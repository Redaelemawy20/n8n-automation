import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : ElevenLabs Orchestrator
// Nodes   : 3  |  Connections: 2
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Webhook                            webhook
// AnswerQuestion                     executeWorkflow
// RespondToWebhook                   respondToWebhook
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → AnswerQuestion
//      → RespondToWebhook
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '4SXX6537g0lMMskn',
    name: 'ElevenLabs Orchestrator',
    active: true,
    isArchived: false,
    projectId: 'yjKa7zz0t0LP3t2k',
    settings: { executionOrder: 'v1', availableInMCP: true },
})
export class ElevenlabsOrchestratorWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'c0a1e2b3-4d5f-4a6b-8c7d-9e0f1a2b3c4d',
        webhookId: '5f2b8c1e-7d4a-4e9b-a3c6-1d8e0f7b2a94',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-288, -32],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'orchestrator',
        authentication: 'none',
        responseMode: 'responseNode',
        options: {},
    };

    @node({
        id: '6b8d0f2a-4c6e-4a8b-9d1f-3e5a7c9b1d24',
        name: 'Answer Question',
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [-32, -32],
        notes: 'Runs the "Answer Question" workflow (the AI agent with the meals sheet).',
    })
    AnswerQuestion = {
        source: 'database',
        workflowId: {
            __rl: true,
            value: '9Zbdidu3NLNOiIft',
            mode: 'list',
            cachedResultName: 'Answer Question',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                message: '={{ $json.body.message }}',
                sessionId: '={{ $json.body.sessionId }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'message',
                    displayName: 'message',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'sessionId',
                    displayName: 'sessionId',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: true,
        },
        mode: 'once',
        options: {
            waitForSubWorkflow: true,
        },
    };

    @node({
        id: 'b5f6d7a8-9cae-4fb0-9b2c-4d5e6f7a8b9c',
        name: 'Respond to Webhook',
        type: 'n8n-nodes-base.respondToWebhook',
        version: 1.5,
        position: [224, -32],
    })
    RespondToWebhook = {
        respondWith: 'json',
        responseBody: '={{ { "reply": $json.output } }}',
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Webhook.out(0).to(this.AnswerQuestion.in(0));
        this.AnswerQuestion.out(0).to(this.RespondToWebhook.in(0));
    }
}
