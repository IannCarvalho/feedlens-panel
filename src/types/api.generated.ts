/**
 * ARQUIVO GERADO -- NAO EDITE A MAO.
 *
 * Gerado por scripts/gen-api-types.mjs a partir do contrato OpenAPI do
 * backend (feedlens), fixado ao commit ed534ef0d50e347728cafb68d8e9b3c4c8f0d474.
 * Para regenerar: suba o SHA em api-spec.version e rode `npm run gen:api`.
 */

export interface paths {
    "/api/feedbacks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lista feedbacks analisados (mais novos primeiro). */
        get: {
            parameters: {
                query?: {
                    page?: components["parameters"]["Page"];
                    /** @description Capado em 100 pelo servidor. */
                    per_page?: components["parameters"]["PerPage"];
                    sentiment?: components["parameters"]["SentimentFilter"];
                    spam?: components["parameters"]["SpamFilter"];
                    analysis?: components["parameters"]["AnalysisFilter"];
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Pagina de feedbacks. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FeedbackListResponse"];
                    };
                };
                /** @description Parametro de query invalido. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Autenticacao necessaria para ler os feedbacks. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Recebe e analisa um feedback.
         * @description Formulario publico. A autorizacao segue app/ingest_auth.py: sem INGEST_API_KEY o endpoint e aberto; com ela exige X-API-Key; o modo publico opt-in aceita um Origin permitido sob limites estritos; BYOK por requisicao usa X-LLM-Provider + X-LLM-Api-Key.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    "X-API-Key"?: components["parameters"]["XApiKey"];
                    "X-LLM-Provider"?: components["parameters"]["XLlmProvider"];
                    "X-LLM-Api-Key"?: components["parameters"]["XLlmApiKey"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["FeedbackIngestRequest"];
                };
            };
            responses: {
                /** @description Feedback recebido (analisado, ou gravado como nao analisado). */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FeedbackIngestResult"];
                    };
                };
                /** @description Corpo invalido (JSON malformado, campos ausentes, id nao-UUID, texto vazio ou longo demais). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Chave de ingestao exigida e ausente/invalida. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Ja existe um feedback com esse id. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description BYOK recusado pelo provedor, ou headers BYOK invalidos. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit ou teto diario da ingestao publica. */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description O provedor BYOK falhou com a credencial enviada. */
                502: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Nenhum provedor de LLM configurado. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/feedbacks/{feedback_id}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description UUID do feedback. */
                feedback_id: components["parameters"]["FeedbackId"];
            };
            cookie?: never;
        };
        /** Busca um feedback pelo id. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description UUID do feedback. */
                    feedback_id: components["parameters"]["FeedbackId"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description O feedback pedido. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Feedback"];
                    };
                };
                /** @description id malformado (nao e UUID). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Autenticacao necessaria. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Feedback nao encontrado. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Revisao humana da analise (is_spam e/ou sentiment).
         * @description Sessao do painel + CSRF. Nao aceita API_READ_TOKEN: corrigir a analise e acao de quem opera o painel.
         */
        patch: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Token CSRF da sessao (de GET /auth/session ou GET /api/settings/providers). */
                    "X-CSRF-Token"?: components["parameters"]["XCsrfToken"];
                };
                path: {
                    /** @description UUID do feedback. */
                    feedback_id: components["parameters"]["FeedbackId"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["FeedbackReviewRequest"];
                };
            };
            responses: {
                /** @description Feedback atualizado (ou inalterado, se repetir o mesmo valor). */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Feedback"];
                    };
                };
                /** @description id malformado, corpo nao-objeto, ou nenhum/ invalido campo revisavel. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Nao autenticado no painel. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description DASHBOARD_PASSWORD ausente (auth_not_configured) ou CSRF invalido. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Feedback nao encontrado. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/feedbacks/{feedback_id}/reanalyze": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description UUID do feedback. */
                feedback_id: components["parameters"]["FeedbackId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Roda a IA de novo num feedback (cadeia de provedores do servidor).
         * @description Sessao do painel + CSRF. Sincrono; espera a resposta da IA.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Token CSRF da sessao (de GET /auth/session ou GET /api/settings/providers). */
                    "X-CSRF-Token"?: components["parameters"]["XCsrfToken"];
                };
                path: {
                    /** @description UUID do feedback. */
                    feedback_id: components["parameters"]["FeedbackId"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Feedback reanalisado e atualizado. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Feedback"];
                    };
                };
                /** @description id malformado (nao e UUID). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Nao autenticado no painel. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description DASHBOARD_PASSWORD ausente ou CSRF invalido. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Feedback nao encontrado. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description A IA nao respondeu de novo (analysis_unavailable, com o motivo em detail e o feedback em feedback), ou nenhum provedor configurado (llm_not_configured). */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ReanalyzeUnavailableError"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/feedbacks/reanalyze-pending": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reanalisa em lote os feedbacks que a IA nao conseguiu analisar.
         * @description Sessao do painel + CSRF. Corpo opcional {"limit": int} (1..10, padrao 5). Cada feedback do lote e uma chamada paga; para no primeiro erro de provedor.
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Token CSRF da sessao (de GET /auth/session ou GET /api/settings/providers). */
                    "X-CSRF-Token"?: components["parameters"]["XCsrfToken"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["ReanalyzePendingRequest"];
                };
            };
            responses: {
                /** @description Resultado do lote. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ReanalyzePendingResponse"];
                    };
                };
                /** @description Corpo nao-objeto, ou limit fora de 1..10 (invalid_limit). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Nao autenticado no painel. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description DASHBOARD_PASSWORD ausente ou CSRF invalido. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Rate limit da reanalise em lote. */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Nenhum provedor de LLM configurado. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Estatisticas do dashboard + feedbacks recentes. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Estatisticas (sem dados, ou o painel completo). */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DashboardStats"];
                    };
                };
                /** @description Autenticacao necessaria. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Estado da sessao do painel + token CSRF.
         * @description Rota publica (o login depende dela). Responde Cache-Control no-store.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Estado da sessao. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SessionResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login do painel (JSON + X-CSRF-Token). */
        post: {
            parameters: {
                query?: {
                    /** @description Destino pos-login; o servidor so aceita caminhos locais. */
                    next?: components["parameters"]["NextQuery"];
                };
                header?: {
                    /** @description Token CSRF da sessao (de GET /auth/session ou GET /api/settings/providers). */
                    "X-CSRF-Token"?: components["parameters"]["XCsrfToken"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["LoginRequest"];
                };
            };
            responses: {
                /** @description Login aceito (ou auth desligada); next ja filtrado. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["LoginResponse"];
                    };
                };
                /** @description CSRF ausente/invalido (a sessao expirou). */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Senha incorreta. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Muitas tentativas de login. */
                429: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Encerra a sessao do painel (por GET, idempotente). */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deslogado; redireciona para o login. */
                302: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        put?: never;
        /**
         * Encerra a sessao do painel.
         * @description Idempotente e sem CSRF; sempre redireciona para o login (302).
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Deslogado; redireciona para o login. */
                302: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Readiness/liveness probe (valida o app e o banco). */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description App e banco de pe. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Health"];
                    };
                };
                /** @description Banco inacessivel. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Health"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/settings/providers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Catalogo, cadeia do ambiente e chaves salvas. */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Estado do cofre de provedores. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProvidersResponse"];
                    };
                };
                /** @description Nao autenticado no painel. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description DASHBOARD_PASSWORD ausente (auth_not_configured) ou CSRF invalido. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        put?: never;
        /** Cadastra uma chave de provedor. */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Token CSRF da sessao (de GET /auth/session ou GET /api/settings/providers). */
                    "X-CSRF-Token"?: components["parameters"]["XCsrfToken"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ProviderCreateRequest"];
                };
            };
            responses: {
                /** @description Chave criada. */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProviderCredential"];
                    };
                };
                /** @description Corpo/provedor/modelo/chave/prioridade/enabled invalidos. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Nao autenticado no painel. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description DASHBOARD_PASSWORD ausente ou CSRF invalido. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Chave duplicada, limite de chaves atingido. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description O provedor recusou a chave (verificacao). */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Cofre desligado (FEEDLENS_ENCRYPTION_KEY ausente). */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/settings/providers/{credential_id}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description UUID da chave de provedor. */
                credential_id: components["parameters"]["CredentialId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Remove uma chave de provedor. */
        delete: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Token CSRF da sessao (de GET /auth/session ou GET /api/settings/providers). */
                    "X-CSRF-Token"?: components["parameters"]["XCsrfToken"];
                };
                path: {
                    /** @description UUID da chave de provedor. */
                    credential_id: components["parameters"]["CredentialId"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Chave removida. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Nao autenticado no painel. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description DASHBOARD_PASSWORD ausente ou CSRF invalido. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Chave nao encontrada. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        /** Atualiza uma chave de provedor. */
        patch: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Token CSRF da sessao (de GET /auth/session ou GET /api/settings/providers). */
                    "X-CSRF-Token"?: components["parameters"]["XCsrfToken"];
                };
                path: {
                    /** @description UUID da chave de provedor. */
                    credential_id: components["parameters"]["CredentialId"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ProviderUpdateRequest"];
                };
            };
            responses: {
                /** @description Chave atualizada. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProviderCredential"];
                    };
                };
                /** @description Corpo invalido ou nada para alterar. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Nao autenticado no painel. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description DASHBOARD_PASSWORD ausente ou CSRF invalido. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Chave nao encontrada. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description A alteracao colide com uma chave existente (duplicada). */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description O provedor recusou a nova chave. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Cofre desligado. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/settings/providers/reorder": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reordena a cadeia de chaves (prioridade). */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Token CSRF da sessao (de GET /auth/session ou GET /api/settings/providers). */
                    "X-CSRF-Token"?: components["parameters"]["XCsrfToken"];
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["ReorderRequest"];
                };
            };
            responses: {
                /** @description Cadeia reordenada. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProvidersListResponse"];
                    };
                };
                /** @description ids ausente ou invalido. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Nao autenticado no painel. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description DASHBOARD_PASSWORD ausente ou CSRF invalido. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/settings/providers/{credential_id}/test": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description UUID da chave de provedor. */
                credential_id: components["parameters"]["CredentialId"];
            };
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Testa a chave salva (1 chamada minima paga) e registra o resultado. */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /** @description Token CSRF da sessao (de GET /auth/session ou GET /api/settings/providers). */
                    "X-CSRF-Token"?: components["parameters"]["XCsrfToken"];
                };
                path: {
                    /** @description UUID da chave de provedor. */
                    credential_id: components["parameters"]["CredentialId"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resultado do teste. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ProviderTestResult"];
                    };
                };
                /** @description Nao autenticado no painel. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description DASHBOARD_PASSWORD ausente ou CSRF invalido. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Chave nao encontrada. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Nao foi possivel decifrar a chave (FEEDLENS_ENCRYPTION_KEY mudou). */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
                /** @description Cofre desligado. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["Error"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @enum {string} */
        Sentiment: "POSITIVO" | "NEGATIVO" | "INCONCLUSIVO";
        /** @enum {string} */
        AnalysisStatus: "analyzed" | "unanalyzed";
        /** @enum {string} */
        SpamMode: "exclude" | "include" | "only";
        /** @enum {string} */
        AnalysisFilter: "any" | "unanalyzed";
        /** @enum {string} */
        ProviderId: "openai" | "anthropic" | "gemini" | "groq" | "openrouter";
        Error: {
            error: string;
            code?: string;
            detail?: string | null;
        } & {
            [key: string]: unknown;
        };
        RequestedFeature: {
            code: string;
            reason: string;
        };
        Feedback: {
            id: string;
            feedback: string;
            sentiment: components["schemas"]["Sentiment"] | null;
            is_spam: boolean;
            analysis_status: components["schemas"]["AnalysisStatus"];
            analysis_error: string | null;
            analyzed_by: string | null;
            created_at: string;
            requested_features: components["schemas"]["RequestedFeature"][];
        };
        FeedbackIngestRequest: {
            /** @description UUID valido. */
            id: string;
            /** @description Texto nao-vazio, ate MAX_FEEDBACK_CHARS. */
            feedback: string;
        } & {
            [key: string]: unknown;
        };
        FeedbackIngestResult: {
            id: string;
            sentiment: components["schemas"]["Sentiment"] | null;
            is_spam: boolean;
            requested_features: components["schemas"]["RequestedFeature"][];
            analyzed_by: string | null;
            analysis_status: components["schemas"]["AnalysisStatus"];
            analysis_error: string | null;
        };
        /** @description Pelo menos um de is_spam / sentiment. */
        FeedbackReviewRequest: {
            is_spam?: boolean;
            sentiment?: components["schemas"]["Sentiment"];
        } & {
            [key: string]: unknown;
        };
        Pagination: {
            page: number;
            per_page: number;
            total: number;
            pages: number;
            has_next: boolean;
            has_prev: boolean;
        };
        FeedbackListResponse: {
            items: components["schemas"]["Feedback"][];
            pagination: components["schemas"]["Pagination"];
            sentiment: string | null;
            spam: components["schemas"]["SpamMode"];
            analysis: components["schemas"]["AnalysisFilter"];
        };
        ReanalyzePendingRequest: {
            /** @default 5 */
            limit: number;
        } & {
            [key: string]: unknown;
        };
        ReanalyzePendingResponse: {
            processed: number;
            analyzed: number;
            failed: number;
            remaining: number;
            stopped_reason: null | "provider_error";
        };
        ReanalyzeUnavailableError: {
            error: string;
            code?: string;
            detail?: string | null;
            feedback?: components["schemas"]["Feedback"];
        } & {
            [key: string]: unknown;
        };
        DashboardStats: {
            has_data: boolean;
            unanalyzed?: number;
            total_feedbacks?: number;
            sentiment_counts?: components["schemas"]["SentimentCounts"];
            sentiment_percentages?: {
                [key: string]: number;
            };
            top_features?: components["schemas"]["FeatureStat"][];
            recent_feedbacks?: components["schemas"]["Feedback"][];
        };
        SentimentCounts: {
            POSITIVO?: number;
            NEGATIVO?: number;
            INCONCLUSIVO?: number;
        } & {
            [key: string]: unknown;
        };
        FeatureStat: {
            code: string;
            count: number;
            percentage?: number;
        } & {
            [key: string]: unknown;
        };
        SessionResponse: {
            auth_enabled: boolean;
            authenticated: boolean;
            csrf_token: string;
        };
        LoginRequest: {
            password: string;
        } & {
            [key: string]: unknown;
        };
        LoginResponse: {
            ok: boolean;
            next: string;
        };
        Health: {
            /** @enum {string} */
            status: "ok" | "degraded";
            /** @enum {string} */
            database: "ok" | "error";
        };
        ProviderCatalogEntry: {
            id: components["schemas"]["ProviderId"];
            label: string;
            default_model: string;
            server_key_configured: boolean;
        };
        ProviderCredential: {
            id: string;
            provider: components["schemas"]["ProviderId"];
            model: string;
            priority: number;
            enabled: boolean;
            key_hint: string;
            last_verified_at: string | null;
            last_error_kind: string | null;
            created_at: string;
        };
        ProvidersResponse: {
            vault_enabled: boolean;
            csrf_token: string;
            catalog: components["schemas"]["ProviderCatalogEntry"][];
            environment_chain: string[];
            providers: components["schemas"]["ProviderCredential"][];
        };
        ProvidersListResponse: {
            providers: components["schemas"]["ProviderCredential"][];
        };
        ProviderCreateRequest: {
            provider: components["schemas"]["ProviderId"];
            api_key: string;
            model?: string;
            priority?: number;
            enabled?: boolean;
            /** @default true */
            verify: boolean;
        } & {
            [key: string]: unknown;
        };
        /** @description Pelo menos um campo alteravel. */
        ProviderUpdateRequest: {
            enabled?: boolean;
            priority?: number;
            model?: string;
            api_key?: string;
            verify?: boolean;
        } & {
            [key: string]: unknown;
        };
        ReorderRequest: {
            ids: string[];
        };
        ProviderTestResult: {
            ok: boolean;
            kind: string | null;
            latency_ms: number | null;
            checked_at: string;
            provider: components["schemas"]["ProviderCredential"];
        };
    };
    responses: never;
    parameters: {
        /** @description UUID do feedback. */
        FeedbackId: string;
        /** @description UUID da chave de provedor. */
        CredentialId: string;
        Page: number;
        /** @description Capado em 100 pelo servidor. */
        PerPage: number;
        SentimentFilter: components["schemas"]["Sentiment"];
        SpamFilter: components["schemas"]["SpamMode"];
        AnalysisFilter: components["schemas"]["AnalysisFilter"];
        /** @description Destino pos-login; o servidor so aceita caminhos locais. */
        NextQuery: string;
        XApiKey: string;
        XLlmProvider: string;
        XLlmApiKey: string;
        /** @description Token CSRF da sessao (de GET /auth/session ou GET /api/settings/providers). */
        XCsrfToken: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
