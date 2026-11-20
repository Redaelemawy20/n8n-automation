import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Answer Question
// Nodes   : 5  |  Connections: 1
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhenCalled                         executeWorkflowTrigger
// AiAgent                            agent                      [AI]
// OpenaiChatModel                    lmChatOpenAi               [creds] [ai_languageModel]
// SimpleMemory                       memoryBufferWindow         [ai_memory]
// MealsSheet                         googleSheetsTool           [creds] [ai_tool]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenCalled
//    → AiAgent
//
// AI CONNECTIONS
// AiAgent.uses({ ai_languageModel: OpenaiChatModel, ai_memory: SimpleMemory, ai_tool: [MealsSheet] })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '9Zbdidu3NLNOiIft',
    name: 'Answer Question',
    active: false,
    isArchived: false,
    settings: { executionOrder: 'v1', availableInMCP: true },
})
export class AnswerQuestionWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '1e7a3c5b-9d2f-4a6e-8b1c-3f5d7a9e2b40',
        name: 'When called',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.2,
        position: [-288, -32],
        notes: 'Called by other workflows with { message, sessionId }. Returns { output }: the answer text.',
    })
    WhenCalled = {
        inputSource: 'workflowInputs',
        workflowInputs: {
            values: [
                {
                    name: 'message',
                    type: 'string',
                },
                {
                    name: 'sessionId',
                    type: 'string',
                },
            ],
        },
    };

    @node({
        id: 'd1b2f3c4-5e6a-4b7c-9d8e-0f1a2b3c4d5e',
        name: 'AI Agent',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 3.1,
        position: [-32, -32],
    })
    AiAgent = {
        promptType: 'define',
        text: '={{ $json.message }}',
        options: {
            systemMessage: `You are a friendly, helpful assistant for a restaurant, helping users with questions about the menu: which meals are available, their prices, ingredients and anything else listed about them.

Always use the "Meals sheet" tool to look up meal information before answering questions about meals. Only state facts that appear in the sheet; if something is not there, say you do not have that information. Never make up meals or prices.

Keep answers short, clear and conversational, and reply in the same language the user writes in.`,
        },
    };

    @node({
        id: 'e2c3a4d5-6f7b-4c8d-8e9f-1a2b3c4d5e6f',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [-160, 200],
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
        id: 'f3d4b5e6-7a8c-4d9e-9f0a-2b3c4d5e6f7a',
        name: 'Simple Memory',
        type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
        version: 1.4,
        position: [-16, 200],
    })
    SimpleMemory = {
        sessionIdType: 'customKey',
        sessionKey: "={{ $('When called').item.json.sessionId }}",
        contextWindowLength: 10,
    };

    @node({
        id: 'a4e5c6f7-8b9d-4eaf-8a1b-3c4d5e6f7a8b',
        name: 'Meals sheet',
        type: 'n8n-nodes-base.googleSheetsTool',
        version: 4.7,
        position: [128, 200],
        credentials: { googleSheetsOAuth2Api: { id: '6JwBJOQl0iimeFgk', name: 'Google Sheets account 2' } },
    })
    MealsSheet = {
        descriptionType: 'manual',
        toolDescription:
            'Reads all rows of the meals sheet: the list of meals with their details (such as name, price and description). Use it whenever the user asks about meals, the menu, prices or ingredients.',
        resource: 'sheet',
        operation: 'read',
        documentId: {
            __rl: true,
            value: 'https://docs.google.com/spreadsheets/d/1cpdkciILA1EksQzFCZspPjYydYAFLqZZCkrQEK12d5s/edit?gid=0#gid=0',
            mode: 'url',
        },
        sheetName: {
            __rl: true,
            value: 'https://docs.google.com/spreadsheets/d/1cpdkciILA1EksQzFCZspPjYydYAFLqZZCkrQEK12d5s/edit?gid=0#gid=0',
            mode: 'url',
        },
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WhenCalled.out(0).to(this.AiAgent.in(0));

        this.AiAgent.uses({
            ai_languageModel: this.OpenaiChatModel.output,
            ai_memory: this.SimpleMemory.output,
            ai_tool: [this.MealsSheet.output],
        });
    }
}
