export function calcularDV(nit) {
  if (!nit) return "";

  // 1. Limpiar entrada
  let myNit = nit.toString().replace(/\s|,|\.|-/g, "");

  // 2. Validar que sea número
  if (isNaN(myNit)) {
    console.error(`El NIT/cédula '${myNit}' no es válido(a).`);
    return "";
  }

  // 3. Factores de la DIAN (16 posiciones)
  const vpri = [
    0,   // índice 0 sin usar, para coincidir con el algoritmo original
    3, 7, 13, 17, 19, 23, 29, 
    37, 41, 43, 47, 53, 59, 67, 71
  ];

  let z = myNit.length;
  let x = 0;

  // 4. Multiplicar cada dígito por su factor correspondiente
  for (let i = 0; i < z; i++) {
    let y = parseInt(myNit.charAt(i), 10);
    x += y * vpri[z - i];
  }

  // 5. Sacar residuo y DV
  let y = x % 11;
  return y > 1 ? 11 - y : y;
}
