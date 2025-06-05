// Gerenciamento de pedidos
function getPedidos() {
  const pedidos = localStorage.getItem("pedidos")
  return pedidos ? JSON.parse(pedidos) : []
}

function adicionarPedido(pedido) {
  const pedidos = getPedidos()
  pedidos.push(pedido)
  localStorage.setItem("pedidos", JSON.stringify(pedidos))
}

function carregarPedidos() {
  const pedidos = getPedidos()
  const container = document.getElementById("pedidos-lista")

  if (pedidos.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>Nenhum pedido encontrado</p>
                <small style="color: #9ca3af;">Clique em "Adicionar Pedido Teste" para criar alguns exemplos</small>
            </div>
        `
    return
  }

  const tabela = `
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Material</th>
                    <th>Endereço</th>
                    <th>Data</th>
                    <th>Peso</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${pedidos
                  .map(
                    (pedido) => `
                    <tr>
                        <td>#${pedido.id}</td>
                        <td>${pedido.cliente}</td>
                        <td>${pedido.tipo}</td>
                        <td>${pedido.endereco}</td>
                        <td>${pedido.data}</td>
                        <td>${pedido.peso}</td>
                        <td>
                            <span class="status-badge status-${pedido.status.toLowerCase()}">
                                ${pedido.status}
                            </span>
                        </td>
                        <td>
                            ${
                              pedido.status === "Pendente"
                                ? `<button class="btn" style="background: #059669; color: white; padding: 6px 12px; font-size: 0.8rem;" onclick="alterarStatus(${pedido.id}, 'Coletado')">
                                    <i class="fas fa-check"></i> Coletar
                                </button>`
                                : `<button class="btn" style="background: #6b7280; color: white; padding: 6px 12px; font-size: 0.8rem;" onclick="alterarStatus(${pedido.id}, 'Pendente')">
                                    <i class="fas fa-undo"></i> Pendente
                                </button>`
                            }
                            <button class="btn" style="background: #dc2626; color: white; padding: 6px 12px; font-size: 0.8rem; margin-left: 5px;" onclick="removerPedido(${pedido.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `

  container.innerHTML = tabela
}

function atualizarEstatisticas() {
  const pedidos = getPedidos()

  const total = pedidos.length
  const pendentes = pedidos.filter((p) => p.status === "Pendente").length
  const coletados = pedidos.filter((p) => p.status === "Coletado").length

  document.getElementById("total-pedidos").textContent = total
  document.getElementById("pedidos-pendentes").textContent = pendentes
  document.getElementById("pedidos-coletados").textContent = coletados
}

function removerPedido(id) {
  if (confirm("Deseja realmente remover este pedido?")) {
    const pedidos = getPedidos()
    const novosPedidos = pedidos.filter((p) => p.id !== id)
    localStorage.setItem("pedidos", JSON.stringify(novosPedidos))
    carregarPedidos()
    atualizarEstatisticas()
  }
}

// Inicializar alguns pedidos de exemplo se não existirem
function inicializarDadosExemplo() {
  const pedidos = getPedidos()
  if (pedidos.length === 0) {
    const exemplos = [
      {
        id: 1,
        cliente: "Maria Silva",
        tipo: "Papel",
        endereco: "Rua das Flores, 123 - Centro",
        data: "05/06/2025",
        status: "Pendente",
        peso: "15.5 kg",
      },
      {
        id: 2,
        cliente: "João Santos",
        tipo: "Plástico",
        endereco: "Av. Principal, 456 - Jardim",
        data: "04/06/2025",
        status: "Coletado",
        peso: "8.2 kg",
      },
      {
        id: 3,
        cliente: "Ana Costa",
        tipo: "Metal",
        endereco: "Rua Verde, 789 - Vila Nova",
        data: "03/06/2025",
        status: "Pendente",
        peso: "22.1 kg",
      },
    ]

    localStorage.setItem("pedidos", JSON.stringify(exemplos))
  }
}

// Chamar na inicialização
if (typeof window !== "undefined") {
  inicializarDadosExemplo()
}
