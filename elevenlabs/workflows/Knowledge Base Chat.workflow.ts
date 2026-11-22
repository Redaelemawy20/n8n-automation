import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Knowledge Base Chat
// Nodes   : 6  |  Connections: 1
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhenChatMessageReceived            chatTrigger
// AiAgent                            agent                      [AI]
// OpenaiChatModel                    lmChatOpenAi               [creds] [ai_languageModel]
// SimpleMemory                       memoryBufferWindow         [ai_memory]
// ProductKnowledgeBase               vectorStoreSupabase        [AI] [creds] [ai_tool]
// EmbeddingsOpenai                   embeddingsOpenAi           [creds] [ai_embedding]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenChatMessageReceived
//    → AiAgent
//
// AI CONNECTIONS
// AiAgent.uses({ ai_languageModel: OpenaiChatModel, ai_memory: SimpleMemory, ai_tool: [ProductKnowledgeBase] })
// ProductKnowledgeBase.uses({ ai_embedding: EmbeddingsOpenai })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'lRB5lpTyuwcIdZ93',
    name: 'Knowledge Base Chat',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: true },
})
export class KnowledgeBaseChatWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '2c6e8a1f-4b3d-4f7e-9a5c-1d8b0e6f3a27',
        webhookId: '7f1a3c5e-9b2d-4e6f-8a0c-4d2b6e8f1a39',
        name: 'When chat message received',
        type: '@n8n/n8n-nodes-langchain.chatTrigger',
        version: 1.4,
        position: [-288, -32],
    })
    WhenChatMessageReceived = {
        options: {},
    };

    @node({
        id: '5a9d2f6b-3e1c-4b8a-a7d4-6c0f2e9b5d13',
        name: 'AI Agent',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 3.1,
        position: [-32, -32],
    })
    AiAgent = {
        options: {
            systemMessage: `You are a friendly, helpful assistant for an online store, helping users with questions about its products: what is available, prices, descriptions, stock and categories.

Always use the "Product knowledge base" tool to look up products before answering questions about them. Only state facts that appear in the results; if something is not there, say you do not have that information. Never make up products, prices or stock levels.

Keep answers short, clear and conversational, and reply in the same language the user writes in.`,
        },
    };

    @node({
        id: '8b1e4c7a-6d2f-4a9e-b3c5-7e0a1d4f8b62',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [-176, 200],
        credentials: { openAiApi: { id: 'j2bUw5aInGu7c23D', name: 'OpenAI account' } },
    })
    OpenaiChatModel = {
        model: {
            __rl: true,
            value: 'gpt-4.1-mini',
            mode: 'list',
            cachedResultName: 'gpt-4.1-mini',
        },
        options: {},
    };

    @node({
        id: '9c2f5d8b-7e3a-4b1f-8c6d-8f1b2e5a9c74',
        name: 'Simple Memory',
        type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
        version: 1.3,
        position: [-32, 200],
    })
    SimpleMemory = {
        contextWindowLength: 10,
    };

    @node({
        id: '1d3a6e9c-8f4b-4c2a-9d7e-9a2c3f6b1d85',
        name: 'Product knowledge base',
        type: '@n8n/n8n-nodes-langchain.vectorStoreSupabase',
        version: 1.3,
        position: [128, 200],
        credentials: { supabaseApi: { id: '9y2fkOfnSwBoGhyf', name: 'Supabase account' } },
    })
    ProductKnowledgeBase = {
        mode: 'retrieve-as-tool',
        toolDescription:
            'Searches the product catalog. Each result is one product with its name, price, description and stock, plus its category in the metadata. Use it whenever the user asks about products, prices, availability or categories.',
        tableName: {
            __rl: true,
            value: 'documents',
            mode: 'list',
            cachedResultName: 'documents',
        },
        topK: 5,
        includeDocumentMetadata: true,
        options: {
            queryName: 'match_documents',
        },
    };

    @node({
        id: '4e7b0a3d-2c5f-4d8b-a1e6-0b3d4a7c2e96',
        name: 'Embeddings OpenAI',
        type: '@n8n/n8n-nodes-langchain.embeddingsOpenAi',
        version: 1.2,
        position: [208, 400],
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
        this.WhenChatMessageReceived.out(0).to(this.AiAgent.in(0));

        this.AiAgent.uses({
            ai_languageModel: this.OpenaiChatModel.output,
            ai_memory: this.SimpleMemory.output,
            ai_tool: [this.ProductKnowledgeBase.output],
        });
        this.ProductKnowledgeBase.uses({
            ai_embedding: this.EmbeddingsOpenai.output,
        });
    }
}
