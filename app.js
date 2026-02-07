// Adding cardArtSeries and cardArtGrade element references
const cardArtSeries = document.getElementById('card-art-series');
const cardArtGrade = document.getElementById('card-art-grade');

// Updating dataset.series and dataset.grade assignments in renderCard() function
function renderCard(card) {
    // other existing code
    cardArtSeries.dataset.series = card.series;
    cardArtGrade.dataset.grade = card.grade;

    // Updating textContent
    cardArtSeries.textContent = card.series;
    cardArtGrade.textContent = card.grade;
}