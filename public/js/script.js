const api = axios.create({
  baseURL: 'http://localhost:5000'
})

let pessoas = [];
let id = '';

preencherLinha();

async function criarUsuario () {
  const form = document.getElementById("form1");
  const nome = form.elements["user"].value;
  const senha = form.elements["password"].value;
  const repeatPass = form.elements["reapeat-pass"].value

  if (nome && senha) {
    const lsUsers = await api.get(`/users`).then((response) => {
      return response.data
    })
    if (!lsUsers.find((user) => user.nome === nome)) {
      const user = {
        name: nome,
        password: senha,
        repeatPass
      };
      await api.post(`/users`, user).then((response) => {
        alert("usuario criado com exito");
        window.location.replace("index.html");
      }).catch((error) => {
        console.error(error);
      })
    } else {
      alert("Usuário já existente.");
    }
  }
}


async function login () {
  // botao de entrar
  const form = document.getElementById("formlogin");
  const nome = form.elements["user"].value;
  const senha = form.elements["password"].value;

  const lsUsers = await api.get(`/users`).then((response) => {
    return response.data
  })

  // o sinal de interrogação verifica se o objeto pai é diferente de null, false ou undefined
  if (!!nome && !!senha) {
    await api.post(`/login`, { user: nome, password: senha }).then((response) => {
      alert("Você está logado!");
      localStorage.setItem("userId", JSON.stringify(response.data.id));
      window.location.replace("index3.html");
    }).catch((error) => {
      console.error(error);
    })
  } else {
    alert("Erro no login ou usuário nao cadastrado");
  }
}

function montarRecados () {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  if (loggedUser) {
    const users = JSON.parse(localStorage.getItem("users"));
    const userObj = users.find((user) => user.nome === loggedUser.nome);
    if (!!userObj.descricoes && !!userObj.detalhamentos) {
      userObj.descricoes.forEach((descricao, index) =>
        preencherLinha(index, descricao, userObj.detalhamentos[index])
      );
    }
  }
}

function adicionarRecado (id, description, details) {
  const descriptionInput = document.getElementById("description").value;
  const detailsInput = document.getElementById("details").value;

  if (!!!descriptionInput && !!!detailsInput) {
    return alert("Preencha os campos");
  }

  const recado = {
    description: descriptionInput,
    details: detailsInput,
  };

  

  users[userIndex]["recados"].push(recado);


  return preencherLinha();
}

async function preencherLinha () {
  const tbody = table.querySelector("tbody");
  const id = localStorage.getItem("userId");
  // Criar recados
  const recados = await api.get(`/message/${JSON.parse(id)}`).then((response) => {
    return response.data.data
  })

  tbody.innerHTML = "";
  
  recados?.forEach((recado, index) => {
    const row = tbody.insertRow();
    const id = row.insertCell(0);
    const description = row.insertCell(1);
    const details = row.insertCell(2);
    const actions = row.insertCell(3);

    id.innerHTML = index + 1;
    description.innerHTML = recado.description;
    details.innerHTML = recado.details;
    actions.innerHTML = `<button onclick="editar(${index})" class="btn btn-primary mx-2">Editar</button><button class="btn btn-danger mx-2">Excluir</button>`;
  });

}

function editar (indice) {
  $("#exampleModalCenter").modal("show");

  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const users = JSON.parse(localStorage.getItem("users"));
  const userIndex = users.findIndex((user) => user?.nome === loggedUser?.nome);

  const descriptionEdit = document.getElementById("descriptionEdit");
  const detailsEdit = document.getElementById("detailsEdit");

  const buttonSaveEdit = document.getElementById("buttonSaveEdit");

  const recadoParaEdicao = users[userIndex].recados[indice];

  descriptionEdit.value = recadoParaEdicao.description;
  detailsEdit.value = recadoParaEdicao.details;

  buttonSaveEdit.onclick = () => {
    if (!!!descriptionEdit && !!!detailsEdit) {
      return alert("Preencha os campos");
    }

    let recado = {
      description: descriptionEdit.value,
      details: detailsEdit.value,
    };

    console.log(recado);

    users[userIndex].recados[indice] = recado;

    //editar recado
    
    $("#exampleModalCenter").modal("hide");
    preencherLinha();
  };
}

function deslogar () {
  localStorage.removeItem("userId");
  window.location.replace("index.html");
}

async function verificaUsuarioLogado () {
  const id = localStorage.getItem("userId");

  if (id != null) {
    return await api.get(`/users/${JSON.parse(id)}`).then((response) => {
    }).catch((error) => {
      console.error(error);
      alert("Você precisa estar logado para acessar essa página");
      window.location.replace("index.html");
    })

  }
  alert("Você precisa estar logado para acessar essa página");
  window.location.replace("index.html");
}

if (window.location.pathname.includes('index3')) {
  verificaUsuarioLogado();
}



