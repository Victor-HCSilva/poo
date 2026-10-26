let turma = [];

function salvar(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const n1 = Number(document.getElementById('n1').value);
  const n2 = Number(document.getElementById('n2').value);
  const n3 = Number(document.getElementById('n3').value);
  const arquivo = document.getElementById('foto').files[0];

  if (!nome) {
    alert('Informe o nome do aluno.');
    return;
  }

  // Valida o tipo e o tamanho da imagem (máximo de 5 MB).
  if (arquivo && !arquivo.type.startsWith('image/')) {
    alert('Selecione um arquivo de imagem válido.');
    return;
  }

  if (arquivo && arquivo.size > 5 * 1024 * 1024) {
    alert('A imagem deve ter no máximo 5 MB.');
    return;
  }

  if (arquivo) {
    const leitor = new FileReader();

    leitor.onload = function() {
      cadastrarAluno(nome, n1, n2, n3, leitor.result);
    };

    leitor.onerror = function() {
      alert('Não foi possível carregar a imagem.');
    };

    leitor.readAsDataURL(arquivo);
  } else {
    cadastrarAluno(nome, n1, n2, n3, '');
  }
}

function cadastrarAluno(nome, n1, n2, n3, foto) {
  const aluno = new Aluno(nome, n1, n2, n3);

  aluno.foto = foto;
  aluno.media = aluno.gerarMedia(n1, n2, n3);

  turma.push(aluno);

  alert('Aluno cadastrado com sucesso!');

  document.getElementById('form-aluno').reset();
  document.getElementById('preview-foto').hidden = true;
  document.getElementById('preview-foto').src = '';
  document.getElementById('texto-preview').hidden = false;

  atualizarLista();
}

function preVisualizarFoto(event) {
  const arquivo = event.target.files[0];
  const preview = document.getElementById('preview-foto');
  const texto = document.getElementById('texto-preview');

  if (!arquivo) {
    preview.hidden = true;
    preview.src = '';
    texto.hidden = false;
    return;
  }

  if (!arquivo.type.startsWith('image/') || arquivo.size > 5 * 1024 * 1024) {
    alert('Selecione uma imagem válida de até 5 MB.');
    event.target.value = '';
    preview.hidden = true;
    preview.src = '';
    texto.hidden = false;
    return;
  }

  const leitor = new FileReader();

  leitor.onload = function() {
    preview.src = leitor.result;
    preview.hidden = false;
    texto.hidden = true;
  };

  leitor.readAsDataURL(arquivo);
}

function atualizarLista() {
  let lista = document.getElementById('lista-alunos');
  lista.replaceChildren();

  if (turma.length === 0) {
    const mensagem = document.createElement('p');
    mensagem.className = 'mensagem-vazia';
    mensagem.textContent = 'Nenhum aluno cadastrado ainda.';
    lista.appendChild(mensagem);
    return;
  }

  turma.forEach((aluno) => {
    const card = document.createElement('article');
    card.className = 'aluno-card';

    const foto = document.createElement('img');
    foto.className = 'foto-aluno';
    foto.alt = `Foto de ${aluno.nome}`;

    if (aluno.foto) {
      foto.src = aluno.foto;
    } else {
      foto.src = 'https://placehold.co/160x160?text=Sem+Foto';
    }

    const dados = document.createElement('div');
    dados.className = 'dados-aluno';

    const nome = document.createElement('h3');
    nome.textContent = aluno.nome;

    const media = document.createElement('p');
    media.textContent = `Média: ${Number(aluno.media).toFixed(1)}`;

    const estado = document.createElement('p');
    estado.className = 'estado-aluno';
    estado.textContent = aluno.gerarEstado(aluno.media);

    dados.append(nome, media, estado);
    card.append(foto, dados);
    lista.appendChild(card);
  });
}

function listar() {
  document.getElementById('btn-listar').classList.add('active');
  document.getElementById('btn-cadastrar').classList.remove('active');

  document.getElementById('tab-listar').classList.add('active');
  document.getElementById('tab-cadastrar').classList.remove('active');

  atualizarLista();
}

function cadastrar() {
  // Cadastra os alunos
  document.getElementById('btn-cadastrar').classList.add('active');
  document.getElementById('btn-listar').classList.remove('active');

  document.getElementById('tab-cadastrar').classList.add('active');
  document.getElementById('tab-listar').classList.remove('active');
}

function display(alunosFiltrados) {
  // Faz a exibição dos alunos, filtrados ou não
  // Recebe uma lista de Aluno
  let lista = document.getElementById('lista-alunos');
  lista.replaceChildren();
  alunosFiltrados.forEach((aluno) => {
    const card = document.createElement('article');
    card.className = 'aluno-card';

    const foto = document.createElement('img');
    foto.className = 'foto-aluno';
    foto.alt = `Foto de ${aluno.nome}`;

    if (aluno.foto) {
      foto.src = aluno.foto;
    } else {
      foto.src = 'https://placehold.co/160x160?text=Sem+Foto';
    }

    const dados = document.createElement('div');
    dados.className = 'dados-aluno';

    const nome = document.createElement('h3');
    nome.textContent = aluno.nome;

    const media = document.createElement('p');
    media.textContent = `Média: ${Number(aluno.media).toFixed(1)}`;

    const estado = document.createElement('p');
    estado.className = 'estado-aluno';
    estado.textContent = aluno.gerarEstado(aluno.media);

    dados.append(nome, media, estado);
    card.append(foto, dados);
    lista.appendChild(card);
  });
}

function buscar() {
  let lista = document.getElementById('lista-alunos');
  lista.replaceChildren();
  const palavra = document.getElementById('valor_pesquisar').value;

  // Aplica o filtro
  filtro = new Filtro(turma, palavra);

  if (palavra !== null) {
    let fTurma = filtro.pesquisar()
    display(fTurma)
  } else {
    display(turma)
  }
}
