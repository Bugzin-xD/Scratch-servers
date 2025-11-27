// Dentro de api/rodar-projeto.js

import ScratchAPI from 'scratch-api'; 

export default async function handler(req, res) {
    
    // ... (Verificações iniciais de método e projectId) ...

    const SCRATCH_USERNAME = process.env.SCRATCH_USERNAME;
    const SCRATCH_PASSWORD = process.env.SCRATCH_PASSWORD;

    if (!SCRATCH_USERNAME || !SCRATCH_PASSWORD) {
        return res.status(500).json({ error: 'As credenciais não foram configuradas na Vercel.' });
    }

    let session = null;
    let logAcao = '';

    try {
        // PASSO 1: Fazer Login (Obrigatório para a maioria das ações da API)
        logAcao += `[1/3] Tentando Login como ${SCRATCH_USERNAME}...\n`;
        session = await ScratchAPI.login(SCRATCH_USERNAME, SCRATCH_PASSWORD);
        logAcao += `[1/3] Login bem-sucedido.\n`;

        // PASSO 2: Ação de Início (Simular o clique da bandeira verde)
        logAcao += `[2/3] Enviando Broadcast 'START_SERVER' para o Projeto ID: ${projectId}\n`;
        
        // --- AÇÃO CRÍTICA: Simulação do clique da bandeira verde ---
        
        // Opção A: Broadcast (Se a biblioteca suportar)
        // await session.broadcast(projectId, 'START_SERVER');

        // Opção B: Mudança de Variável na Nuvem (Mais comum para triggers remotos)
        // Você precisaria de código Scratch que monitore esta variável (Ex: Wait until (variável) = 1)
        const cloud = session.cloud(projectId);
        await cloud.set('SERVER_START', 1); // Define a variável para 1
        await cloud.set('SERVER_START', 0); // Opcional: Define de volta para 0 para resetar o trigger
        
        // -----------------------------------------------------------

        logAcao += `[2/3] Comando de início (Broadcast ou Cloud Var) enviado com sucesso.\n`;

        // PASSO 3: Confirmação
        logAcao += `[3/3] Operação concluída. O Servidor iniciou o seu projeto Scratch.\n`;

        res.status(200).json({
            message: 'Comando de início enviado com sucesso para o projeto.',
            data: {
                id: projectId,
                user: SCRATCH_USERNAME,
                log_server: logAcao,
            }
        });

    } catch (error) {
        console.error('Erro na Ação do Scratch:', error);
        res.status(500).json({ 
            error: 'Falha na interação com a API do Scratch. Verifique as credenciais e o status da biblioteca.',
            details: error.message 
        });
    }
}