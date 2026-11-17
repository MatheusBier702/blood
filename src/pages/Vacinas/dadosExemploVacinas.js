// Paciente de exemplo, só para demonstrar a aba enquanto o backend não existe.
// As datas são geradas em relação a hoje: uma criança de 16 meses com parte do
// calendário em dia, a dose de 9 meses da covid-19 em atraso e as vacinas dos
// 15 meses ainda por fazer. A pessoa pode trocar a data de nascimento na aba.

const dois = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;

export function gerarExemplo(hoje = new Date()) {
  const nascimento = new Date(hoje.getFullYear(), hoje.getMonth() - 16, hoje.getDate() - 10);
  const aos = (meses, dias = 0) =>
    iso(new Date(nascimento.getFullYear(), nascimento.getMonth() + meses, nascimento.getDate() + dias));
  const local = "UBS Centro";
  let n = 0;
  const dose = (vacina, rotulo, data, lote = "") => ({ id: `ex${(n += 1)}`, vacina, dose: rotulo, data, local, lote, observacoes: "" });

  return {
    perfil: { nome: "Paciente de exemplo", dataNascimento: iso(nascimento) },
    aplicacoes: [
      dose("bcg", "Dose única", aos(0), "BCG-2301"),
      dose("hb", "Dose ao nascer", aos(0), "HB-1188"),
      dose("penta", "1ª dose", aos(2)),
      dose("vip", "1ª dose", aos(2)),
      dose("vrh", "1ª dose", aos(2)),
      dose("pneumo", "1ª dose", aos(2)),
      dose("menc", "1ª dose", aos(3)),
      dose("penta", "2ª dose", aos(4)),
      dose("vip", "2ª dose", aos(4)),
      dose("vrh", "2ª dose", aos(4)),
      dose("pneumo", "2ª dose", aos(4)),
      dose("menc", "2ª dose", aos(5)),
      dose("penta", "3ª dose", aos(6)),
      dose("vip", "3ª dose", aos(6)),
      dose("covid", "1ª dose", aos(6)),
      dose("influenza", "1ª dose (primeira vez)", aos(6, 3)),
      dose("covid", "2ª dose", aos(7)),
      dose("influenza", "2ª dose (primeira vez)", aos(7, 3)),
      dose("vfa", "1ª dose", aos(9)),
      dose("pneumo", "Reforço", aos(12)),
      dose("menacwy", "Reforço", aos(12)),
      dose("scr", "1ª dose", aos(12)),
    ],
  };
}
