import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Ingest Products
// Nodes   : 6  |  Connections: 3
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ManualTrigger                      manualTrigger
// GetProducts                        googleSheets               [creds]
// MapFields                          set
// SupabaseVectorStore                vectorStoreSupabase        [AI] [creds]
// DefaultDataLoader                  documentDefaultDataLoader  [ai_document]
// EmbeddingsOpenai                   embeddingsOpenAi           [creds] [ai_embedding]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ManualTrigger
//    → GetProducts
//      → MapFields
//        → SupabaseVectorStore
//
// AI CONNECTIONS
// SupabaseVectorStore.uses({ ai_embedding: EmbeddingsOpenai, ai_document: [DefaultDataLoader] })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'GKDgGuOdgqCNKFaq',
    name: 'Ingest Products',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: true, binaryMode: 'separate' },
})
export class IngestProductsWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '3a8f1c6e-2b4d-4e7a-9c5f-8d1e0b2a6c47',
        name: 'Manual Trigger',
        type: 'n8n-nodes-base.manualTrigger',
        version: 1,
        position: [-288, -32],
    })
    ManualTrigger = {};

    @node({
        id: '6d2b9e4f-7a1c-4f3b-8e6d-0c5a9b2f7e13',
        name: 'Get products',
        type: 'n8n-nodes-base.googleSheets',
        version: 4.7,
        position: [-32, -32],
        credentials: { googleSheetsOAuth2Api: { id: '6JwBJOQl0iimeFgk', name: 'Google Sheets account 2' } },
        notes: 'Reads every row of the product catalog sheet filled by the Product Catalog Seeder.',
    })
    GetProducts = {
        documentId: {
            __rl: true,
            value: 'https://docs.google.com/spreadsheets/d/1Txajl1p6_ftfXh1t17xsDAQekMjMnkaaLYgMiNUuZtY/edit?gid=0#gid=0',
            mode: 'url',
        },
        sheetName: {
            __rl: true,
            value: 'https://docs.google.com/spreadsheets/d/1Txajl1p6_ftfXh1t17xsDAQekMjMnkaaLYgMiNUuZtY/edit?gid=0#gid=0',
            mode: 'url',
        },
        options: {},
    };

    @node({
        id: '9e4c7a2d-5f1b-4d8e-a3c6-2b7f0e9d4a58',
        name: 'Map fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [224, -32],
    })
    MapFields = {
        assignments: {
            assignments: [
                {
                    id: 'b1f5d8a3-4c7e-4a2b-9f6d-3e8c1a5b7d90',
                    name: 'content',
                    value: `=Name: {{ $json.Name }}
Price: {{ $json.Price }}
Description: {{ $json.Description }}
Stock: {{ $json.Stock }}`,
                    type: 'string',
                },
                {
                    id: 'c2a6e9b4-5d8f-4b3c-8a7e-4f9d2b6c8e01',
                    name: 'category',
                    value: '={{ $json.Category }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '4f7b2e9c-8d3a-4c6f-b1e5-7a0d9c3b2f64',
        name: 'Supabase Vector Store',
        type: '@n8n/n8n-nodes-langchain.vectorStoreSupabase',
        version: 1.3,
        position: [480, -32],
        credentials: { supabaseApi: { id: '9y2fkOfnSwBoGhyf', name: 'Supabase account' } },
    })
    SupabaseVectorStore = {
        mode: 'insert',
        tableName: {
            __rl: true,
            value: 'documents',
            mode: 'list',
            cachedResultName: 'documents',
        },
        options: {},
    };

    @node({
        id: '6e000df3-37ef-433c-ad39-6ac0d98f5ee6',
        name: 'Default Data Loader',
        type: '@n8n/n8n-nodes-langchain.documentDefaultDataLoader',
        version: 1.1,
        position: [624, 96],
    })
    DefaultDataLoader = {
        dataType: 'json',
        jsonMode: 'expressionData',
        jsonData: '={{ $json.content }}',
        textSplittingMode: 'simple',
        options: {
            metadata: {
                metadataValues: [
                    {
                        name: 'category',
                        value: '={{ $json.category }}',
                    },
                ],
            },
        },
    };

    @node({
        id: '8c3d5a7e-1f9b-4e2c-a6d8-5b0e3f7c9a12',
        name: 'Embeddings OpenAI',
        type: '@n8n/n8n-nodes-langchain.embeddingsOpenAi',
        version: 1.2,
        position: [432, 96],
        credentials: { openAiApi: { id: 'j2bUw5aInGu7c23D', name: 'OpenAI account' } },
    })
    EmbeddingsOpenai = {
        model: 'text-embedding-3-small',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ManualTrigger.out(0).to(this.GetProducts.in(0));
        this.GetProducts.out(0).to(this.MapFields.in(0));
        this.MapFields.out(0).to(this.SupabaseVectorStore.in(0));

        this.SupabaseVectorStore.uses({
            ai_embedding: this.EmbeddingsOpenai.output,
            ai_document: [this.DefaultDataLoader.output],
        });
    }
}
