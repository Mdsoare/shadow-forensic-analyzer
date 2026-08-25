# 🔒 Shadow Forensic Analyzer

![CI Pipeline](https://github.com/Mdsoare/shadow-forensic-analyzer/actions/workflows/ci-pipeline.yml/badge.svg)
[![Security Rating](https://img.shields.io/badge/Security-DevSecOps%20Hardened-green?style=flat&logo=github)](https://github.com/Mdsoare/shadow-forensic-analyzer/security/code-scanning)
![Security: CSP Compliant](https://img.shields.io/badge/Security-CSP--Compliant-success.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

<!-- Badges de Linguagens, Ecossistema e DevSecOps -->

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Dependabot](https://img.shields.io/badge/Dependabot-025E8C?style=for-the-badge&logo=dependabot&logoColor=white)
![SAST & SCA](https://img.shields.io/badge/DevSecOps-SAST%20%26%20SCA-red?style=for-the-badge&logo=shield&logoColor=white)

> Aplicação web client-side de alta performance para auditoria estática, parsing, validação de conformidade e análise forense do arquivo `/etc/shadow` de sistemas _Linux/Unix_.

---

## 📋 Propósito do Projeto

Em investigações de computação forense e auditorias de segurança defensiva (Blue Team), a verificação de políticas de senhas e a conformidade de credenciais armazenadas localmente no arquivo `/etc/shadow` é uma etapa essencial.

O **Shadow Forensic Analyzer** foi projetado sob o princípio **Privacy First**: todo o processamento, cálculo de expiração de senhas e categorização dos hashes ocorrem 100% no contexto da memória local do seu navegador. Nenhum hash, nome de usuário ou arquivo de sistema trafega pela rede ou sai da sua estação de trabalho.

---

## ✨ Funcionalidades

- 🚀 **Parsing Instantâneo do `/etc/shadow`:** Leitura e separação automática dos 9 campos padrão do arquivo de senhas do Linux (usuário, hash, data da última alteração, dias mínimos/máximos, aviso, inatividade, expiração e reservado).

- 🛡️ **Análise de Risco & Algoritmos de Hash:** Mapeamento automático do tipo de hashing utilizado (Yescrypt `$7$`, SHA-512 `$6$`, SHA-256 `$5$`, MD5 `$1$`, DES) e identificação imediata de hashes fracos ou legados.

- ⚠️ **Identificação de Alertas Críticos:** Detecção de contas com senhas desativadas (`*` ou `!`), contas sem senha (hashes nulos/vazios), usuários com UID/GID privilegiado e políticas de expiração vencidas.

- 🔒 **DevSecOps & CSP Hardened:** Interface desenvolvida sem scripts ou estilos _inline_, imune a injeção de código _DOM-based XSS_ e totalmente aderente a políticas estritas de _Content Security Policy (CSP)_.

- 🧪 **Amostra Integrada para Testes:** Botão interativo para inserção automática de uma estrutura `/etc/shadow` simulada para testes e demonstrações rápidas.

- ⚡ **100% Client-Side:** Execução nativa no navegador, dispensando qualquer dependência de backend, banco de dados ou suporte de servidor.

---

## 📖 Guia de Uso

### Artefatos de Entrada (O que carregar)

O analisador processa linhas no formato padrão de armazenamento de credenciais e políticas de senhas do Linux.

- **Nome do Artefato Original:** `/etc/shadow` (acessível como `root` em sistemas Linux ou extraído via imagens forenses/dumps de partição).

- **Formato Esperado no Campo de Texto:** Entrada de texto delimitada por dois pontos (:):

  ```text
  <username>:<password_hash>:<lastchanged>:<min>:<max>:<warn>:<inact>:<expire>:<reserved>
  ```

- **Exemplo de Conteúdo:**

  ```text
  root:$6$v1S2g3H4$qR8L...:19700:0:90:7:::
  sysadmin:$7$cC8Y...:19820:0:60:7:30:19900:
  guest:!:19000:0:99999:7:::
  tester::19500:0:90:7:::
  ```

---

### Passo a Passo de Utilização

1. **Acesse a Aplicação:** Abra a interface web (`index.html` via GitHub Pages ou localmente).
2. **Obtenha os Dados:** Copie o conteúdo ou as linhas desejadas do arquivo `/etc/shadow` extraído na sua auditoria forense
3. **Insira os Dados:** Cole as linhas estruturadas no campo de texto "INSIRA O CONTEÚDO DO /ETC/SHADOW"
   - **Opcional:** Para validar o funcionamento da interface sem dados reais, clique no botão **Carregar Amostra /etc/shadow**.
4. **Execute a Análise:** Clique no botão principal **Analisar e Auditar Shadow**.
5. **Avalie o Relatório:** A tabela de resultados exibirá a análise categorizada:
   - **Usuário & Identificação:** Nome da conta e status do acesso.
   - **Algoritmo de Hash:** Identificação visual do algoritmo de proteção (Yescrypt, SHA-512, etc.) e alertas para cifras legadas.
   - **Políticas de Expiração:** Prazos de troca obrigatória, período de inatividade e datas de expiração calculadas.
   - **Status de Risco:** Indicadores visuais automáticos para contas críticas sem senha ou com credenciais vencidas.

---

### Como Obter o Arquivo `/etc/shadow` em Auditorias Legítimas

O arquivo `/etc/shadow` armazena de forma restrita os hashes criptográficos das senhas do sistema Unix/Linux. Por questões de segurança, apenas o usuário privilegiado (`root` ou usuários com privilégios `sudo`) possui permissão de leitura.

1. Coleta Direta via Linha de Comando (Ambiente Local/SSH):

   ```bash
   # Visualização direta com privilégios de superusuário
   sudo cat /etc/shadow

   # Cópia para análise em diretório de triagem
   sudo cp /etc/shadow ./shadow_audit.txt
   sudo chown $USER:$USER ./shadow_audit.txt
   ```

2. Extração Forense Offline (Montagem de Imagem de Disco):

   Em cenários de resposta a incidentes ou análise post-mortem, a extração deve ser feita sem inicializar o sistema operacional afetado:

   ```bash
   # Exemplo de montagem de imagem E01 / DD em ambiente de perícia
   sudo mount -o ro,loop /caminho/para/imagem_disco.dd /mnt/forensic

   # Acesso ao arquivo na partição montada
   cat /mnt/forensic/etc/shadow
   ```

3. Validação e Combinação com `/etc/passwd` (Opcional):
   Para associar o `UID` e `GID` de cada conta ao hash correspondente, você pode cruzar os dados usando a ferramenta nativa `unshadow` do pacote _**John the Ripper**_:

   ```bash
   unshadow /etc/passwd /etc/shadow > unshadowed_output.txt
   ```

---

## 🛠️ Tecnologias & Ecossistema DevSecOps

- **Frontend:** HTML5, Pure CSS3 (Dark Theme) e Vanilla JavaScript (ES6+ sem dependências de runtime).
- **Gerenciamento & Pacotes:** Node.js & npm (DevDependencies e Scripts de Linting/Auditoria).
- **Automação & CI/CD:** GitHub Actions & GitHub Dependabot.
- **Segurança Estática (SAST):** CodeQL, Horusec, Semgrep, ESLint (Flat Config), Stylelint, HTMLHint e TruffleHog (Secret Scanning).
- **Análise de Dependências & Misconfig (SCA):** OSV-Scanner, Trivy Scan e `npm audit`.

---

## ⚠️ AVISO LEGAL E USO ÉTICO (DISCLAIMER)

### 🚨 Uso Estritamente Ético e Educacional

Esta ferramenta foi criada exclusivamente para **fins educacionais, auditorias autorizadas de segurança da informação, investigações forenses legítimas e atividades defensivas de Red/Blue Team**.

### ⛔ Isenção de Responsabilidade

1. **Autorização Prévia:** O uso desta ferramenta contra sistemas, redes ou bases de credenciais sem o consentimento formal e por escrito do proprietário é ilegal e passível de sanções civis e criminais.
2. **Uso Indevido:** O autor deste projeto (**Marcelo Soares / [Mdsoare](https://github.com/Mdsoare)**) **não se responsabiliza** por qualquer uso indevido, danos, vazamento de dados, incidentes de segurança ou violações legais causados pela utilização desta aplicação.
3. **Responsabilidade do Usuário:** A responsabilidade inteira pelo uso ético, legal e em conformidade com as regulamentações aplicáveis (como LGPD/GDPR) recai exclusivamente sobre o usuário que opera a ferramenta.

---

## 📜 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

_Desenvolvido por **Marcelo Soares** | Especialista em Segurança da Informação e Computação Forense._
