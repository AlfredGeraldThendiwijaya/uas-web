$(document).ready(function() {
    function generateRandomValue(gaugeElement) {
        var random = Math.random() * 100;
        var fixNumber = random.toFixed(1) + "°C";

        gaugeElement.text(fixNumber);

        var degreeValue = random * 2.5;
        gaugeElement.css({
            "font-family": "'Oswald', sans-serif",
            "font-size": "2rem",
            "font-weight": "lighter",
            "color": "#7D7C7C",
        });
        gaugeElement.css({
            "backgroundImage": `
                radial-gradient(closest-side, #fff 0%, #fff calc(100% - 2rem), transparent calc(100% - 2rem)),
                conic-gradient(from -125deg, rgb(0, 221, 255) 0deg ${degreeValue}deg, transparent ${degreeValue}deg 250deg),
                conic-gradient(from -125deg, lightgray 0deg 250deg, transparent 250deg)
            `
        });
    }

    // Generate Random Value for existing gauges
    $(".gauge").each(function() {
        generateRandomValue($(this));
    });

    // Event handler for the "Hide" button
    $(document).on("click",".button-container button[id='hide']",function() {
        var gauge = $(this).closest(".d-flex").find(".gauge");
        if (gauge.is(":hidden")) {
            gauge.show();
            $(this).text("Hide");
        } else {
            gauge.hide();
            $(this).text("Show");
        }
    });

    // Event handler for the "Delete" button (with event delegation)
    $(document).on("click", ".button-container button[id='delete']", function() {
        var gauge = $(this).closest(".d-flex").find(".gauge");
        gauge.closest(".col-md-4").remove();
    });

    // Event handler for the "Tambah" button in the navbar
    $(".tambah").click(function() {
        var newGauge = `<div class="col-md-4 mb-3">
            <div class="d-flex flex-column">
                <div class="gauge">
                </div>
                <div class="button-container">
                    <button type="button" class="btn btn-info" id="hide">Hide</button>
                    <button type="button" class="btn btn-danger" id="delete">Delete</button>
                </div>
            </div>
        </div>`;

        $(".row").append(newGauge);

        generateRandomValue($(".row").find(".gauge").last());
    });

    let navbar = document.querySelector(".navbar-brand");
    let teksbaru = document.createTextNode("Temperature Indicator");
    navbar.appendChild(teksbaru);
});
