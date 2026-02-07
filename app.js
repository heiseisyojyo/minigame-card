// Assuming these are added at the top of your app.js file
const cardArtSeries = "series-name"; // or appropriate value
const cardArtGrade = "grade-name"; // or appropriate value

function renderCard(card) {
    // existing rendering logic
    const cardElement = document.createElement('div');
    cardElement.setAttribute('data-series', cardArtSeries);
    cardElement.setAttribute('data-grade', cardArtGrade);
    // additional logic to set the text content for the art series/grade
    cardElement.textContent = `${cardArtSeries} - ${cardArtGrade}`;
    // append to parent or other operations
}
