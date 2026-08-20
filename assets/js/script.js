document.addEventListener('DOMContentLoaded', () => {
    const btnSample = document.getElementById('btnSample');
    const btnAudit = document.getElementById('btnAudit');

    if (btnSample) {
        btnSample.addEventListener('click', loadShadowSample);
    }

    if (btnAudit) {
        btnAudit.addEventListener('click', parseShadowData);
    }
});

function loadShadowSample() {
    const sample = "root:$6$rounds=5000$saltsalt$H8uG2k9PmxZlc91mOpqWz4b9xJn6t8Kq9YmWvC3rE5xBc7z9mKq1a2b3c4d5e6f7g8h9i0j:19842:0:99999:7:::\n" +
        "deploy_user:$5$saltsalt$A7jK2m9PmxZlc91mOpqWz4b9xJn6t8K:19842:0:90:7:30::\n" +
        "legacy_app:$1$oldsalt$z8mKp1a2b3c4d5e6f7g8h9:19720:0:30:5:::\n" +
        "nginx:*:19450:0:99999:7:::\n" +
        "postgres:!:19450:0:99999:7:::";

    const inputArea = document.getElementById('shadowInput');
    if (inputArea) {
        inputArea.value = sample;
    }
}

function parseShadowData() {
    const rawInput = document.getElementById('shadowInput').value;
    const tableBody = document.getElementById('shadowTableBody');
    const resultsSection = document.getElementById('resultsSection');

    tableBody.innerHTML = '';

    if (!rawInput.trim()) {
        alert("Insira dados válidos no formato de linha do arquivo /etc/shadow.");
        return;
    }

    const lines = rawInput.split('\n');
    let parsedCount = 0;

    lines.forEach(line => {
        const cleanLine = line.trim();
        if (!cleanLine) return;

        const fields = cleanLine.split(':');

        if (fields.length >= 2) {
            parsedCount++;

            const username = fields[0].trim();
            const passwordField = fields[1] ? fields[1].trim() : '';
            const maxDays = fields[4] ? fields[4].trim() : "Não definido";
            const warnDays = fields[5] ? fields[5].trim() : "Não definido";

            const tr = document.createElement('tr');

            // 1. Nome do Usuário
            const tdUser = document.createElement('td');
            tdUser.className = 'user-text';
            tdUser.textContent = username;

            // 2 e 3. Identificação do algoritmo e hash
            const tdAlgo = document.createElement('td');
            const tdHash = document.createElement('td');

            const badgeAlgo = document.createElement('span');
            badgeAlgo.className = 'badge-algo';

            const spanHash = document.createElement('span');
            spanHash.className = 'hash-box';

            // Status e Riscos
            const tdRisk = document.createElement('td');
            const statusPill = document.createElement('span');
            statusPill.className = 'status-pill';

            if (['*', '!', '!!', ''].includes(passwordField)) {
                badgeAlgo.textContent = "Sem Senha";
                badgeAlgo.style.backgroundColor = "rgba(156, 163, 175, 0.2)";
                badgeAlgo.style.color = "var(--text-muted)";

                spanHash.textContent = "Conta bloqueada / Daemon de serviço";
                spanHash.style.color = "var(--text-muted)";
                spanHash.style.fontStyle = "italic";

                statusPill.textContent = "Protegido (Sem Login)";
                statusPill.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
                statusPill.style.color = "var(--success)";
            } else {
                if (passwordField.startsWith('$6$')) {
                    badgeAlgo.textContent = "SHA-512 ($6$)";
                    badgeAlgo.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
                    badgeAlgo.style.color = "var(--success)";
                    statusPill.textContent = "Padrão Forte";
                    statusPill.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
                    statusPill.style.color = "var(--success)";
                } else if (passwordField.startsWith('$5$')) {
                    badgeAlgo.textContent = "SHA-256 ($5$)";
                    badgeAlgo.style.backgroundColor = "rgba(59, 130, 246, 0.2)";
                    badgeAlgo.style.color = "#60a5fa";
                    statusPill.textContent = "Adequado";
                    statusPill.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
                    statusPill.style.color = "#60a5fa";
                } else if (passwordField.startsWith('$1$')) {
                    badgeAlgo.textContent = "MD5 ($1$)";
                    badgeAlgo.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
                    badgeAlgo.style.color = "var(--danger)";
                    statusPill.textContent = "Crítico: Algoritmo Fraco";
                    statusPill.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                    statusPill.style.color = "var(--danger)";
                } else if (passwordField.startsWith('$y$')) {
                    badgeAlgo.textContent = "Yescrypt ($y$)";
                    badgeAlgo.style.backgroundColor = "rgba(168, 85, 247, 0.2)";
                    badgeAlgo.style.color = "#c084fc";
                    statusPill.textContent = "Excelente (Moderno)";
                    statusPill.style.backgroundColor = "rgba(168, 85, 247, 0.1)";
                    statusPill.style.color = "#c084fc";
                } else {
                    badgeAlgo.textContent = "Desconhecido";
                    badgeAlgo.style.backgroundColor = "rgba(245, 158, 11, 0.2)";
                    badgeAlgo.style.color = "var(--warning)";
                    statusPill.textContent = "Revisar";
                    statusPill.style.backgroundColor = "rgba(245, 158, 11, 0.1)";
                    statusPill.style.color = "var(--warning)";
                }

                spanHash.textContent = passwordField;
            }

            tdAlgo.appendChild(badgeAlgo);
            tdHash.appendChild(spanHash);
            tdRisk.appendChild(statusPill);

            // Prazos de Expiração
            const tdMax = document.createElement('td');
            const maxVal = maxDays || "Não definido";
            tdMax.textContent = maxVal === "99999" ? "Nunca Expira" : (maxVal !== "Não definido" ? `${maxVal} dias` : maxVal);

            if (maxVal !== "99999" && maxVal !== "Não definido" && parseInt(maxVal, 10) < 45) {
                tdMax.style.color = "var(--warning)";
                tdMax.style.fontWeight = "600";
            }

            const tdWarn = document.createElement('td');
            const warnVal = warnDays || "Não definido";
            tdWarn.textContent = warnVal !== "Não definido" ? `${warnVal} dias` : warnVal;

            tr.appendChild(tdUser);
            tr.appendChild(tdAlgo);
            tr.appendChild(tdHash);
            tr.appendChild(tdMax);
            tr.appendChild(tdWarn);
            tr.appendChild(tdRisk);

            tableBody.appendChild(tr);
        }
    });

    if (parsedCount > 0) {
        resultsSection.style.display = 'block';
    } else {
        alert("Nenhuma estrutura compatível encontrada.");
    }
}