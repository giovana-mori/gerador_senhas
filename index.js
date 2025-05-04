const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

function generatePassword(length = 12, options = { uppercase: true, numbers: true, symbols: true }) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = lowercase;
  if (options.uppercase) chars += uppercase;
  if (options.numbers) chars += numbers;
  if (options.symbols) chars += symbols;

  return Array.from({ length }, () => 
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

app.get('/', (req, res) => {
  const { length = 12, uppercase, numbers, symbols } = req.query;
  let password = null;

  // Gera senha apenas se houver parâmetros de consulta
  if (Object.keys(req.query).length > 0) {
    password = generatePassword(parseInt(length), {
      uppercase: uppercase === 'on',
      numbers: numbers === 'on',
      symbols: symbols === 'on'
    });
  }

  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gerador de Senhas Seguras</title>
      <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">
              🔐 Gerador de Senhas
          </h1>
          
          <form method="GET" action="/">
              <div class="mb-4">
                  <label class="block text-gray-700 mb-2">Tamanho: ${length}</label>
                  <input
                      type="range"
                      name="length"
                      min="8"
                      max="32"
                      value="${length}"
                      class="w-full"
                      oninput="this.nextElementSibling.textContent = this.value"
                  >
                  <output class="block text-center text-gray-600">${length}</output>
              </div>

              <div class="space-y-2 mb-6">
                  <label class="flex items-center space-x-2">
                      <input
                          type="checkbox"
                          name="uppercase"
                          class="form-checkbox"
                          ${uppercase === 'on' ? 'checked' : ''}
                      >
                      <span class="text-gray-700">Letras maiúsculas</span>
                  </label>
                  
                  <label class="flex items-center space-x-2">
                      <input
                          type="checkbox"
                          name="numbers"
                          class="form-checkbox"
                          ${numbers === 'on' ? 'checked' : ''}
                      >
                      <span class="text-gray-700">Números</span>
                  </label>
                  
                  <label class="flex items-center space-x-2">
                      <input
                          type="checkbox"
                          name="symbols"
                          class="form-checkbox"
                          ${symbols === 'on' ? 'checked' : ''}
                      >
                      <span class="text-gray-700">Símbolos especiais</span>
                  </label>
              </div>

              <button
                  type="submit"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                  Gerar Senha
              </button>
          </form>

          ${password ? `
          <div class="mt-6 p-4 bg-gray-50 rounded text-center">
              <p class="text-gray-800 font-mono break-all mb-2">${password}</p>
              <button
                  onclick="navigator.clipboard.writeText('${password}')"
                  class="text-blue-600 hover:text-blue-700 text-sm"
              >
                  Copiar senha
              </button>
          </div>
          ` : ''}
      </div>
  </body>
  </html>
  `;

  res.send(html);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});