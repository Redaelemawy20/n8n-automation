import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : TTS
// Nodes   : 4  |  Connections: 2
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// ConvertTextToSpeech                elevenLabs                 [creds]
// AiAgent                            agent                      [AI]
// OpenaiChatModel                    lmChatOpenAi               [creds] [ai_languageModel]
// WhenChatMessageReceived            chatTrigger
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenChatMessageReceived
//    → AiAgent
//      → ConvertTextToSpeech
//
// AI CONNECTIONS
// AiAgent.uses({ ai_languageModel: OpenaiChatModel })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'rIML34FY36R5Jrjj',
    name: 'TTS',
    active: false,
    isArchived: false,
    projectId: 'yjKa7zz0t0LP3t2k',
    settings: { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true },
})
export class TtsWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'e5c6cfd5-cbab-45f9-a6b0-da99cafb3770',
        name: 'Convert text to speech',
        type: '@elevenlabs/n8n-nodes-elevenlabs.elevenLabs',
        version: 1,
        position: [288, -32],
        credentials: { elevenLabsApi: { id: 'nCxBECWIN8Cjlxwr', name: 'ElevenLabs account' } },
    })
    ConvertTextToSpeech = {
        resource: 'speech',
        voice: {
            __rl: true,
            value: 'EXAVITQu4vr4xnSDxMaL',
            mode: 'list',
            cachedResultName: 'Sarah - Mature, Reassuring, Confident',
        },
        text: '={{ $json.output }}',
        additionalOptions: {},
        requestOptions: {},
    };

    @node({
        id: '7de2b6e4-7af7-4550-943d-d834f6299032',
        name: 'AI Agent',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 3.1,
        position: [-64, -32],
    })
    AiAgent = {
        options: {},
    };

    @node({
        id: '0bf0819b-8794-42a7-bf51-b4e29a607dc8',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [8, 200],
        credentials: { openAiApi: { id: 'j2bUw5aInGu7c23D', name: 'OpenAI account' } },
    })
    OpenaiChatModel = {
        model: {
            __rl: true,
            value: 'gpt-4.1-mini',
            mode: 'list',
            cachedResultName: 'gpt-4.1-mini',
        },
        builtInTools: {},
        options: {},
    };

    @node({
        id: 'ff019a51-5326-4ac9-a9e0-3d5a0329ae53',
        webhookId: 'df03fe31-633c-465f-8db5-aabab0eba0f9',
        name: 'When chat message received',
        type: '@n8n/n8n-nodes-langchain.chatTrigger',
        version: 1.5,
        position: [-288, -32],
    })
    WhenChatMessageReceived = {
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.AiAgent.out(0).to(this.ConvertTextToSpeech.in(0));
        this.WhenChatMessageReceived.out(0).to(this.AiAgent.in(0));

        this.AiAgent.uses({
            ai_languageModel: this.OpenaiChatModel.output,
        });
    }
}
