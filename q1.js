//arrays
const biblioteca = [];
const usuarios = [];
const livrosEmprestados = [];
const addMulta = [];
const quitado = [];

menu:
while (true){
    const menu = `
    Selecione uma das opções:
    1 - Cadastrar livro:
    2 - Exibir lista de livros:
    3 - Cadrastrar Usuário:
    4 - Exibir lista de Usuários:
    5 - Realizar empréstimos de livros:
    6 - Registrar devoluções de livros:
    7 - Calcular multas por atraso na devolução:
    8 - Exibir relatórios:
    0 - Sair.
    : `;
    const opcao = parseInt(prompt(menu));
    switch (opcao){
        case 1:
            adicionarLivro();
            break;
        case 2:
            listarLivros();
            break;
        case 3: 
            cadastrarUsuario();
            break;
        case 4:
            listarUsuarios();
            break;
        case 5:
            emprestimos();
            break;
        case 6:
            devolucoes();
            break;
        case 7:
            calcular();
            break;
        case 8:
            relatorios();
            break;
        case 0:
            console.log('Sistema encerrado.');
            break menu;
        default:
            console.log('Opção inválida.');
    };
};

function adicionarLivro() {
    let livro = { 
        titulo: prompt('Digite o Titulo do Livro: ').toLocaleUpperCase(),
        autor: prompt('Digite o nome do Autor: ').toLocaleUpperCase(),
        disponivel: true };
    biblioteca.push(livro);
    console.log(`Livro "${livro.titulo}" adicionado!`);
};

function listarLivros() {
    console.log("\nLista de Livros:");
    biblioteca.forEach((livro, index) => {
        const status = livro.disponivel ? "Disponível" : "Emprestado";
        console.log(`${index + 1}. ${livro.titulo} - ${livro.autor} (${status})`);
    });
};

function cadastrarUsuario() {
    let usuario = { 
        nome: prompt('Digite seu nome: ').toLocaleUpperCase(),
        email: prompt('Digite seu email: ').toLocaleUpperCase(), 
        telefone: Number(prompt('Digite seu contato(número de celular): ')),
    };
    usuarios.push(usuario);
    console.log(`Usuário "${usuario.nome}" cadastrado com sucesso!`);
};

function listarUsuarios() {
    console.log("\nLista de Usuários:");
    usuarios.forEach((usuario, index) => {
        console.log(`${index + 1}. ${usuario.nome} - ${usuario.email} - ${usuario.telefone}`);
    });
};

function emprestimos() {
    console.log('Selecione o titulo do livro a ser emprestado: *ATENÇÃO O PRAZO PARA DEVOLUÇÃO É DE 7 DIAS, AO PASSAR DESSE PRAZO ACARRETARA EM MULTA NO VALOR DE 1 REAL O DIA.');
    let nome = prompt('Digite seu nome: ').toLocaleUpperCase();
    let nomeIndex = usuarios.find((nomeObj) => nomeObj.nome === nome);
    if (!nomeIndex) {
        console.log('Nome do usuario não encontrado.');
        return;
    };
    let livro = prompt('Digite o titulo do livro: ').toLocaleUpperCase();
    let livroIndex = biblioteca.find((livroObj) => livroObj.titulo === livro && livroObj.disponivel);
    if (!livroIndex) {
          console.log('Titulo não encontrado.');
          return;
    };
    livroIndex.disponivel = false;
    livrosEmprestados.push({nome: nome, livro: livro, dataEmprestimo: new Date()});
        console.log('Emprestimos realizado com sucesso, consulte a opção "Exibir Relatórios (8)" para mais informações.');
};

function listarEmprestimos(){
    console.log('\nLista de Empréstimos:');
    if (livrosEmprestados.length === 0){
        console.log('Nenhum Emprestimo ativo.')
        return;
    };
    livrosEmprestados.forEach((emprestimo, index) => {
        console.log(`${index + 1}. ${emprestimo.nome} - ${emprestimo.livro}`);   
    });
};

function devolucoes(){
    const nome = prompt('Digite seu nome de usuario: ').toLocaleUpperCase();
    const livro = prompt('Digite o titulo do livro: ').toLocaleUpperCase();
    const devolucoesIndex = livrosEmprestados.findIndex(a => a.nome === nome && a.livro === livro);

    if(devolucoesIndex === -1){
        console.log('Emprestido não encontrado.');
        return;
    };
    let tituloIndex = biblioteca.find(b => b.titulo === livro);
    tituloIndex.disponivel = true;
    
    livrosEmprestados.splice(devolucoesIndex, 1);
    console.log(`Devolução realizada.`);
};

function calcular(){
    const atual = new Date();
    if (livrosEmprestados.length === 0) {
        console.log("Nenhum livro emprestado para calcular.");
        return;
    };
    
    addMulta.length = 0;
    quitado.length = 0; 

    livrosEmprestados.forEach(a => {
        const dateDevolucao = new Date(a.dataEmprestimo);
        dateDevolucao.setDate(dateDevolucao.getDate() + 7);
        const {nome, livro} = a;

        if(atual > dateDevolucao){
            const atraso = Math.ceil((atual - dateDevolucao) / (1000 * 60 * 60 * 24));
            const multa = atraso * 1;
            console.log(`Em atraso:
                Usuario: ${nome} - Livro: ${livro} - Multa: R$${multa}`);
                addMulta.push({nome, livro, multa});
        } else {
            console.log(`Usuario: ${nome} - Livro: ${livro}. Em dia.`);
            quitado.push({nome: nome, livro});
        };
    });
};

function addMultas(){
    if(addMulta.length === 0){
        console.log('Nenhuma multa pendente.');
        return;
    };
    console.log(' ---- Multas pendentes ----');
    addMulta.forEach((item, index) => {
        console.log(`${index + 1}. Usúario: ${item.nome} - Livro: ${item.livro} - Multa: ${item.multa.toFixed(2)}`)
    }); 
};

function emdia(){
    if(quitado.length === 0){
        console.log('Sem resistros de usúarios em dias')
        return;
    };
    console.log(' ---- Em dia ----');
    quitado.forEach((item, index) => {
        console.log(`${index + 1}. Usúario: ${item.nome} - Livro: ${item.livro}.`)
    });
};

function relatorios(){
    console.log('*** Relatórios ***' );
    listarLivros();
    listarEmprestimos();
    listarUsuarios();
    addMultas();
    emdia();
};
