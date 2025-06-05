// Usuários pré-cadastrados do sistema
const SYSTEM_USERS = [
  {
    email: "admin@fortes.com.br",
    password: "123456",
    name: "Administrador Fortes",
    type: "empresa",
  },
  {
    email: "cooperativas@fortes.com.br",
    password: "123456",
    name: "Cooperativas Fortes",
    type: "both", // Pode acessar tanto como empresa quanto como cliente
  },
]

// Função para obter todos os usuários (sistema + cadastrados)
function getAllUsers() {
  const storedUsers = localStorage.getItem("registeredUsers")
  const registeredUsers = storedUsers ? JSON.parse(storedUsers) : []
  return [...SYSTEM_USERS, ...registeredUsers]
}

// Função para cadastrar novo usuário
function cadastrarUsuario(userData, userType) {
  try {
    const allUsers = getAllUsers()

    // Verificar se email já existe
    const emailExists = allUsers.some((user) => user.email.toLowerCase() === userData.email.toLowerCase())
    if (emailExists) {
      return { success: false, message: "Este email já está cadastrado no sistema." }
    }

    // Criar novo usuário
    const newUser = {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      type: userType,
      registeredAt: new Date().toISOString(),
      ...userData, // Incluir outros dados do formulário
    }

    // Salvar no localStorage
    const storedUsers = localStorage.getItem("registeredUsers")
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : []
    registeredUsers.push(newUser)
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers))

    console.log("Usuário cadastrado com sucesso:", newUser.email)
    return { success: true, message: "Usuário cadastrado com sucesso!" }
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error)
    return { success: false, message: "Erro interno. Tente novamente." }
  }
}

// Função de login para empresa
function loginEmpresa(email, password) {
  console.log("Tentativa de login empresa:", email)

  const allUsers = getAllUsers()
  const user = allUsers.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password &&
      (u.type === "empresa" || u.type === "both"),
  )

  if (user) {
    console.log("Login empresa autorizado para:", email)
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        email: user.email,
        name: user.name,
        type: "empresa",
        loginTime: new Date().getTime(),
      }),
    )
    return true
  } else {
    console.log("Login empresa negado para:", email)
    return false
  }
}

// Função de login para cliente
function loginCliente(email, password) {
  console.log("Tentativa de login cliente:", email)

  const allUsers = getAllUsers()
  const user = allUsers.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password &&
      (u.type === "cliente" || u.type === "both"),
  )

  if (user) {
    console.log("Login cliente autorizado para:", email)
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        email: user.email,
        name: user.name,
        type: "cliente",
        loginTime: new Date().getTime(),
      }),
    )
    return true
  } else {
    console.log("Login cliente negado para:", email)
    return false
  }
}

// Verificar se está logado
function isLoggedIn() {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) {
    return false
  }

  try {
    const user = JSON.parse(currentUser)

    // Verificar se a sessão não expirou (24 horas)
    const loginTime = user.loginTime || 0
    const currentTime = new Date().getTime()
    const hoursDiff = (currentTime - loginTime) / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      console.log("Sessão expirada para:", user.email)
      localStorage.removeItem("currentUser")
      return false
    }

    return true
  } catch (e) {
    console.error("Erro ao verificar sessão:", e)
    localStorage.removeItem("currentUser")
    return false
  }
}

// Obter usuário atual
function getCurrentUser() {
  const currentUser = localStorage.getItem("currentUser")
  if (currentUser) {
    try {
      return JSON.parse(currentUser)
    } catch (e) {
      console.error("Erro ao obter usuário atual:", e)
      return null
    }
  }
  return null
}

// Obter tipo do usuário atual
function getCurrentUserType() {
  const user = getCurrentUser()
  return user ? user.type : null
}

// Logout
function logoutUser() {
  localStorage.removeItem("currentUser")
  console.log("Logout realizado")
}

// Função de validação para páginas protegidas
function validateAccess(requiredType) {
  if (!isLoggedIn()) {
    return false
  }

  const userType = getCurrentUserType()
  if (requiredType && userType !== requiredType) {
    return false
  }

  return true
}

console.log("Sistema de autenticação carregado. Usuários do sistema:", SYSTEM_USERS.length)
