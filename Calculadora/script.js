function calcular(operacion) {
  const n1 = parseFloat(document.getElementById('num1').value);
  const n2 = parseFloat(document.getElementById('num2').value);
  const resultado = document.getElementById('resultado');

  if (isNaN(n1) || isNaN(n2)) {
    resultado.textContent = 'Por favor, ingresa ambos números.';
    return;
  }

  let res;

  switch (operacion) {
    case '+':
      res = n1 + n2;
      break;
    case '-':
      res = n1 - n2;
      break;
    case '*':
      res = n1 * n2;
      break;
    case '/':
      if (n2 === 0) {
        resultado.textContent = 'Error: No se puede dividir por cero.';
        return;
      }
      res = n1 / n2;
      break;
  }

  resultado.textContent = 'Resultado: ' + res;
}