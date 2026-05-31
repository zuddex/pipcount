let positions = [];
let currentIndex = 0;

async function loadPositions() {
    try {
        const response = await fetch("positions.csv");

        if (!response.ok) {
            throw new Error("CSV-Datei konnte nicht geladen werden.");
        }

        const csvText = await response.text();
        const lines = csvText.trim().split(/\r?\n/);

        const headers = lines[0].split(";").map(header => header.trim());

        positions = lines.slice(1)
            .map(line => line.split(";"))
            .filter(values => values[0] && values[0].trim() !== "")
            .map(values => {
                const position = {};

                headers.forEach((header, index) => {
                    if (header !== "") {
                        position[header] = values[index] ? values[index].trim() : "";
                    }
                });

                return position;
            });

        if (positions.length === 0) {
            throw new Error("Keine Positionen in der CSV-Datei gefunden.");
        }

        showPosition();

    } catch (error) {
        document.getElementById("result").innerHTML =
            "Fehler beim Laden der CSV-Datei.";
        console.error(error);
    }
}

function showPosition() {
    const position = positions[currentIndex];

    document.getElementById("boardImage").src =
        "images/" + position.Image;
}

function checkAnswers() {
    const position = positions[currentIndex];

    const userPipWeiss = document.getElementById("PIP_Weiss").value.trim();
    const userPipSchwarz = document.getElementById("PiP_Schwarz").value.trim();
    const userGewinn = document.getElementById("Gewinnprozent_Weiss").value.trim();
    const userDouble = document.getElementById("Double").value;
    const userTake = document.getElementById("Take").value;

    let result = "";

    result += "<h2>Auswertung</h2>";

    result += buildNumberResult(
        "PIP Weiss",
        userPipWeiss,
        position.PIP_Weiss
    );

    result += buildNumberResult(
        "PIP Schwarz",
        userPipSchwarz,
        position.PiP_Schwarz
    );

    result += buildNumberResult(
        "Gewinnprozent Weiss",
        userGewinn,
        position.Gewinnprozent_Weiss
    );

    result += buildTextResult(
        "Double",
        userDouble,
        position.Double
    );

    result += buildTextResult(
        "Take",
        userTake,
        position.Take
    );

    result += "<hr>";
    result += "<strong>Cube-Werte:</strong><br>";
    result += "No Double: " + position.No_Double + "<br>";
    result += "Double Take: " + position.Double_Take + "<br>";
    result += "Double Pass: " + position.Double_Pass + "<br>";

    document.getElementById("result").innerHTML = result;
}

function buildNumberResult(label, userValue, correctValue) {
    const userNumber = parseFloat(userValue);
    const correctNumber = parseFloat(correctValue);

    if (isNaN(userNumber)) {
        return `
            <div class="result-line wrong">
                <strong>${label}</strong><br>
                Dein Wert: keine Eingabe<br>
                Richtiger Wert: ${correctValue}<br>
                Abweichung: -
            </div>
        `;
    }

    const difference = userNumber - correctNumber;
    const absoluteDifference = Math.abs(difference);
    const isCorrect = absoluteDifference === 0;

    return `
        <div class="result-line ${isCorrect ? "correct" : "wrong"}">
            <strong>${label}</strong><br>
            Dein Wert: ${userValue}<br>
            Richtiger Wert: ${correctValue}<br>
            Abweichung: ${formatDifference(difference)}
        </div>
    `;
}

function buildTextResult(label, userValue, correctValue) {
    const userText = trueFalseToJaNein(userValue);
    const correctText = trueFalseToJaNein(correctValue);
    const isCorrect = userValue === correctValue;

    return `
        <div class="result-line ${isCorrect ? "correct" : "wrong"}">
            <strong>${label}</strong><br>
            Deine Antwort: ${userText || "keine Eingabe"}<br>
            Richtige Antwort: ${correctText}<br>
            Abweichung: ${isCorrect ? "keine" : "falsch beantwortet"}
        </div>
    `;
}

function formatDifference(value) {
    if (value > 0) {
        return "+" + value.toFixed(2);
    }

    return value.toFixed(2);
}

function trueFalseToJaNein(value) {
    if (value === "true") {
        return "Ja";
    }

    if (value === "false") {
        return "Nein";
    }

    return value;
}

function nextPosition() {
    currentIndex++;

    if (currentIndex >= positions.length) {
        currentIndex = 0;
    }

    clearInputs();
    showPosition();
}

function clearInputs() {
    document.getElementById("PIP_Weiss").value = "";
    document.getElementById("PiP_Schwarz").value = "";
    document.getElementById("Gewinnprozent_Weiss").value = "";
    document.getElementById("Double").value = "";
    document.getElementById("Take").value = "";
    document.getElementById("result").innerHTML = "";
}

loadPositions();