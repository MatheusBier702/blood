export const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const tipoSanguineoValido = (tipo) => TIPOS_SANGUINEOS.includes(tipo);


export function podeDoar(doador, receptor) {
  if (!tipoSanguineoValido(doador) || !tipoSanguineoValido(receptor)) return false;
  const grupoDoador = doador.slice(0, -1);
  const grupoReceptor = receptor.slice(0, -1);
  const aboCompativel = grupoDoador === 'O' || grupoReceptor === 'AB' || grupoDoador === grupoReceptor;
  const rhCompativel = doador.endsWith('-') || receptor.endsWith('+');
  return aboCompativel && rhCompativel;
}
