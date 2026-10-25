class Filtro {
  constructor(alunos, palavra) {
    this.a = alunos;
    this.p = palavra;
  }
  pesquisar() {
    let encontradas = [];

    if (this.a.length === 0) {
      console.log('Sem alunos cadastrados.');
      return [];
    }

    for (let i = 0; i < this.a.length; i++) {
      if (this.a[i].nome.includes(this.p)) {
        encontradas.push(this.a[i]);
      }
    }

    return encontradas;
  }
}
