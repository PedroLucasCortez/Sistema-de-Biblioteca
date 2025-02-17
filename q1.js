const readline = require('readline');

// Classes
class Livro {
    constructor(titulo, autor) {
        this.titulo = titulo;
        this.autor = autor;
        this.disponivel = true;
    }
}

class Usuario {
    constructor(nome, email, telefone) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.livrosEmprestados = [];
    }
}

class Emprestimo {
    constructor(usuario, livro) {
        this.usuario = usuario;
        this.livro = livro;
        this.dataEmprestimo = new Date();
        this.dataDevolucao = null;
        this.multa = 0;
    }

    devolverLivro() {
        const hoje = new Date();
        const tempoEmprestimo = Math.floor((hoje - this.dataEmprestimo) / (1000 * 60 * 60 * 24));

        if (tempoEmprestimo > 7) {
            this.multa = (tempoEmprestimo - 7) * 1.0; // R$ 1,00 por dia de atraso
        }

        this.livro.disponivel = true;
        this.dataDevolucao = hoje;
    }
}

class Biblioteca {
    constructor() {
        this.livros = [];
        this.usuarios = [];
        this.emprestimos = [];
    }

    cadastrarLivro(titulo, autor) {
        const livro = new Livro(titulo, autor);
        this.livros.push(livro);
        console.log(`Livro "${titulo}" cadastrado com sucesso!`);
    }

    cadastrarUsuario(nome, email, telefone) {
        const usuario = new Usuario(nome, email, telefone);
        this.usuarios.push(usuario);
        console.log(`Usuário "${nome}" cadastrado com sucesso!`);
    }

    emprestarLivro(nomeUsuario, tituloLivro) {
        const usuario = this.usuarios.find(user => user.nome === nomeUsuario);
        const livro = this.livros.find(book => book.titulo === tituloLivro && book.disponivel);

        if (!usuario) {
            console.log("Usuário não encontrado.");
            return;
        }
        if (!livro) {
            console.log("Livro não disponível.");
            return;
        }

        livro.disponivel = false;
        const emprestimo = new Emprestimo(usuario, livro);
        usuario.livrosEmprestados.push(livro);
        this.emprestimos.push(emprestimo);

        console.log(`Livro "${tituloLivro}" emprestado para ${nomeUsuario}.`);
    }

    devolverLivro(nomeUsuario, tituloLivro) {
        const emprestimo = this.emprestimos.find(emp =>
            emp.usuario.nome === nomeUsuario &&
            emp.livro.titulo === tituloLivro &&
            emp.dataDevolucao === null
        );

        if (!emprestimo) {
            console.log("Empréstimo não encontrado.");
            return;
        }

        emprestimo.devolverLivro();
        console.log(`Livro "${tituloLivro}" devolvido por ${nomeUsuario}. Multa: R$${emprestimo.multa.toFixed(2)}`);
    }

    exibirRelatorios() {
        console.log(`
=== Relatórios ===

Livros disponíveis:
${this.livros.filter(l => l.disponivel).map(l => `- ${l.titulo} (${l.autor})`).join('\n')}

Livros emprestados:
${this.livros.filter(l => !l.disponivel).map(l => `- ${l.titulo} (${l.autor})`).join('\n')}

Usuários cadastrados:
${this.usuarios.map(u => `- ${u.nome} (${u.email}, ${u.telefone})`).join('\n')}

Empréstimos ativos:
${this.emprestimos.filter(e => e.dataDevolucao === null).map(e => `- ${e.livro.titulo} para ${e.usuario.nome} (Emprestado em: ${e.dataEmprestimo.toLocaleDateString()})`).join('\n')}

Empréstimos com multa:
${this.emprestimos.filter(e => e.multa > 0).map(e => `- ${e.livro.titulo} para ${e.usuario.nome} (Multa: R$ ${e.multa.toFixed(2)})`).join('\n')}
        `);
    }
}

// Configuração do readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const biblioteca = new Biblioteca();

// Função para exibir o menu
function menu() {
    console.log(`
=== Sistema de Biblioteca ===
1. Cadastrar livro
2. Cadastrar usuário
3. Emprestar livro
4. Devolver livro
5. Exibir relatórios
6. Sair
    `);

    rl.question("Escolha uma opção: ", (opcao) => {
        switch (opcao) {
            case '1':
                rl.question("Título do livro: ", (titulo) => {
                    rl.question("Autor do livro: ", (autor) => {
                        biblioteca.cadastrarLivro(titulo, autor);
                        menu();
                    });
                });
                break;
            case '2':
                rl.question("Nome do usuário: ", (nome) => {
                    rl.question("E-mail do usuário: ", (email) => {
                        rl.question("Telefone do usuário: ", (telefone) => {
                            biblioteca.cadastrarUsuario(nome, email, telefone);
                            menu();
                        });
                    });
                });
                break;
            case '3':
                rl.question("Nome do usuário: ", (nomeUsuario) => {
                    rl.question("Título do livro: ", (tituloLivro) => {
                        biblioteca.emprestarLivro(nomeUsuario, tituloLivro);
                        menu();
                    });
                });
                break;
            case '4':
                rl.question("Nome do usuário: ", (nomeUsuario) => {
                    rl.question("Título do livro: ", (tituloLivro) => {
                        biblioteca.devolverLivro(nomeUsuario, tituloLivro);
                        menu();
                    });
                });
                break;
            case '5':
                biblioteca.exibirRelatorios();
                menu();
                break;
            case '6':
                rl.close();
                break;
            default:
                console.log("Opção inválida. Tente novamente.");
                menu();
        }
    });
}

// Inicia o sistema
menu();