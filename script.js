const estados = {
  "DF (Distrito Federal)": [["JDP", "JKR"], ["OVM", "OVV"], ["OZM", "PBZ"], ["REC", "REV"]],
  "GO (Goiás)": [["KAV", "KFC"], ["NFC", "NGZ"], ["NJX", "NLU"], ["NVO", "NWR"], ["OGH", "OHA"], ["OMI", "OOF"], ["PQA", "PRZ"], ["QTN", "QTS"], ["RBK", "RCN"], ["SBW", "SDS"]],
  "MG (Minas Gerais)": [["GKJ", "HOK"], ["NXX", "NYG"], ["OLO", "OMH"], ["OOV", "ORC"], ["OWH", "OXK"], ["PUA", "PZZ"], ["QMQ", "QQZ"], ["QUA", "QUZ"], ["QWR", "QXZ"], ["RFA", "RGD"], ["RMD", "RNZ"], ["RTA", "RVZ"]]
};
function compararPlaca(p1, p2) { return p1.localeCompare(p2); }
function pertenceAoEstado(prefixo) {
  for (const [estado, faixas] of Object.entries(estados)) {
    for (const [inicio, fim] of faixas) {
      if (compararPlaca(prefixo, inicio) >= 0 && compararPlaca(prefixo, fim) <= 0) return estado;
    }
  }
  return null;
}
function identificarEstado(placa) {
  const prefixo = placa.slice(0, 3).toUpperCase();
  const estado = pertenceAoEstado(prefixo);
  return estado ? `Placa ${placa} pertence ao estado: ${estado}` : `Placa ${placa} não pertence a MG, DF ou GO.`;
}
function calcularM(matriculas) {
  let soma = 0;
  for (const mat of matriculas) {
    if (!mat.includes("/")) throw new Error(`Matrícula inválida: ${mat}. Use o formato 000000/0.`);
    const match = mat.match(/(\d+)\/(\d)/);
    if (match) {
      const corpo = match[1];
      const digitoAntesBarra = parseInt(corpo.charAt(corpo.length - 1));
      soma += digitoAntesBarra;
    }
  }
  return soma / 100;
}
function validarHora(hora) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);
}
function calcularValorEstacionamento(horaEntrada, horaSaida, m) {
  if (!validarHora(horaEntrada)) throw new Error("Hora de entrada inválida. Use o formato HH:MM (ex: 08:30).");
  if (!validarHora(horaSaida)) throw new Error("Hora de saída inválida. Use o formato HH:MM (ex: 18:45).");
  const entrada = new Date(`2023-01-01T${horaEntrada}:00`);
  const saida = new Date(`2023-01-01T${horaSaida}:00`);
  if (saida <= entrada) throw new Error("A hora de saída deve ser depois da hora de entrada.");
  const diff = (saida - entrada) / 60000;
  if (diff <= 15) return 0;
  if (diff <= 180) return 10;
  const extra = diff - 180;
  return 10 + Math.ceil(extra / 20) * (2 + m);
}
formulario.addEventListener("submit", function(e) {
  e.preventDefault();
  const placa = document.getElementById("placa").value.trim();
  const entrada = document.getElementById("entrada").value.trim();
  const saida = document.getElementById("saida").value.trim();
  const matriculas = document.getElementById("matriculas").value.split(",").map(m => m.trim());
  try {
    const estadoMsg = identificarEstado(placa);
    const m = calcularM(matriculas);
    const valor = calcularValorEstacionamento(entrada, saida, m);
    resultado.textContent = `${estadoMsg}\nValor a pagar: R$ ${valor.toFixed(2)}`;
  } catch (err) {
    resultado.textContent = `Erro: ${err.message}`;
  }
});