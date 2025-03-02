
document.addEventListener("DOMContentLoaded", function () {
  const cellsBoard = document.querySelector(".cells-board");
  if (!cellsBoard) {
      console.error("Element .cells-board not found.");
      return;
  }

  const presetValues = [1, 3, 5, 7];
  const presetLimits = {
      1: 7,
      3: 5,
      5: 4,
      7: 3
  };
  let currentPresetIndex = 0;

  const trapsAmountElement = document.getElementById("trapsAmount");
  const prevPresetButton = document.getElementById("prev_preset_btn");
  const nextPresetButton = document.getElementById("next_preset_btn");
  const modeButton = document.getElementById("modeButton");

  let currentMode = "nesk";

  function updateTrapsAmount() {
      if (trapsAmountElement) {
          trapsAmountElement.textContent = presetValues[currentPresetIndex];
      }
  }

  if (prevPresetButton) {
      prevPresetButton.addEventListener("click", function () {
          if (currentPresetIndex > 0) {
              currentPresetIndex--;
              updateTrapsAmount();
          }
      });
  }

  if (nextPresetButton) {
      nextPresetButton.addEventListener("click", function () {
          if (currentPresetIndex < presetValues.length - 1) {
              currentPresetIndex++;
              updateTrapsAmount();
          }
      });
  }

  if (modeButton) {
      modeButton.addEventListener("click", function () {
          currentMode = currentMode === "nesk" ? "all" : "nesk";
          modeButton.textContent = currentMode === "nesk" ? "Switch to All" : "Switch to multiple";
      });
  }

  updateTrapsAmount();

  function addCellClickAnimation() {
      const cells = document.querySelectorAll(".cells-board .cell");
      cells.forEach(cell => {
          // Disable pointer events for the entire cell
          cell.style.pointerEvents = "none";
          // Disable text selection
          cell.style.userSelect = "none";
          cell.style.webkitUserSelect = "none";
      });
  }

  let isFirstPlay = true;
  const playButton = document.getElementById("playButton");

  if (playButton) {
      playButton.addEventListener("click", function () {
          playButton.disabled = true;

          let cells = document.querySelectorAll(".cells-board .cell");
          if (!isFirstPlay) {
              cellsBoard.innerHTML = '';
              populateBoard();
              cells = document.querySelectorAll(".cells-board .cell");
          }

          const trapsCount = parseInt(trapsAmountElement.textContent);
          const totalCells = cells.length;
          const trapIndexes = new Set();

          while (trapIndexes.size < trapsCount) {
              const randomIndex = Math.floor(Math.random() * totalCells);
              trapIndexes.add(randomIndex);
          }

          if (currentMode === "nesk") {
              const allowedTraps = presetLimits[trapsCount] || 0;
              const trapOrder = [];

              while (trapOrder.length < allowedTraps) {
                  const randomTrapIndex = Math.floor(Math.random() * cells.length);
                  if (!trapOrder.includes(randomTrapIndex)) {
                      trapOrder.push(randomTrapIndex);
                  }
              }

              let currentTrapIndex = 0;

              function revealTraps() {
                  if (currentTrapIndex < trapOrder.length) {
                      const trapCellIndex = trapOrder[currentTrapIndex];
                      const trapCell = cells[trapCellIndex];
                      trapCell.classList.add("cell-fade-out");

                      setTimeout(async () => {
                          trapCell.innerHTML = '';
                          try {
                              const response = await fetch("img/stars.svg");
                              const svgContent = await response.text();
                              const svgContainer = document.createElement("div");
                              svgContainer.style.cssText = `
                                  width: 56px;
                                  height: 56px;
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  position: relative;
                                  pointer-events: none;
                              `;
                              svgContainer.innerHTML = svgContent;
                              trapCell.appendChild(svgContainer);

                              const svgElement = svgContainer.querySelector("svg");
                              if (svgElement) {
                                  svgElement.style.cssText = `
                                      width: 56px;
                                      height: 56px;
                                      max-width: 100%;
                                      max-height: 100%;
                                      display: block;
                                      opacity: 0;
                                      transform: scale(0);
                                      transition: opacity 0.3s, transform 0.3s;
                                  `;
                                  requestAnimationFrame(() => {
                                      svgElement.style.opacity = '1';
                                      svgElement.style.transform = "scale(1)";
                                  });
                              }
                          } catch {
                              const fallbackImage = document.createElement("img");
                              fallbackImage.style.cssText = `
                                  width: 56px;
                                  height: 56px;
                                  display: block;
                                  opacity: 0;
                                  transform: scale(0);
                                  transition: opacity 0.3s, transform 0.3s;
                                  pointer-events: none;
                              `;
                              fallbackImage.src = "img/stars.svg";
                              trapCell.appendChild(fallbackImage);
                              requestAnimationFrame(() => {
                                  fallbackImage.style.opacity = '1';
                                  fallbackImage.style.transform = "scale(1)";
                              });
                          }

                          trapCell.classList.remove("cell-fade-out");
                          currentTrapIndex++;
                          setTimeout(revealTraps, 700);
                      }, 400);
                  } else {
                      playButton.disabled = false;
                      isFirstPlay = false;
                  }
              }

              revealTraps();
          } else {
              Promise.all([...cells].map((cell, index) => {
                  return new Promise(async resolve => {
                      cell.classList.add("cell-fade-out");
                      cell.innerHTML = '';
                      try {
                          const response = await fetch(trapIndexes.has(index) ? "img/krest.svg" : "img/stars.svg");
                          const svgContent = await response.text();
                          const svgContainer = document.createElement("div");
                          svgContainer.style.cssText = `
                              width: 56px;
                              height: 56px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              position: relative;
                              pointer-events: none;
                          `;
                          svgContainer.innerHTML = svgContent;
                          cell.appendChild(svgContainer);

                          const svgElement = svgContainer.querySelector("svg");
                          if (svgElement) {
                              svgElement.style.cssText = `
                                  width: 56px;
                                  height: 56px;
                                  max-width: 100%;
                                  max-height: 100%;
                                  display: block;
                                  opacity: 0;
                                  transform: scale(0);
                                  transition: opacity 0.3s, transform 0.3s;
                              `;
                              requestAnimationFrame(() => {
                                  svgElement.style.opacity = '1';
                                  svgElement.style.transform = "scale(1)";
                              });
                          }
                      } catch {
                          const fallbackImage = document.createElement("img");
                          fallbackImage.style.cssText = `
                              width: 56px;
                              height: 56px;
                              display: block;
                              opacity: 0;
                              transform: scale(0);
                              transition: opacity 0.3s, transform 0.3s;
                              pointer-events: none;
                          `;
                          fallbackImage.src = trapIndexes.has(index) ? "img/krest.svg" : "img/stars.svg";
                          cell.appendChild(fallbackImage);
                          requestAnimationFrame(() => {
                              fallbackImage.style.opacity = '1';
                              fallbackImage.style.transform = "scale(1)";
                          });
                      }
                      cell.classList.remove("cell-fade-out");
                      resolve();
                  });
              })).then(() => {
                  playButton.disabled = false;
                  isFirstPlay = false;
              });
          }
      });
  }

  function populateBoard() {
      const images = [
    "output_svgs/1 (1).svg", "output_svgs/1 (2).svg", "output_svgs/1 (3).svg",
    "output_svgs/1 (4).svg", "output_svgs/1 (5).svg", "output_svgs/1 (6).svg",
    "output_svgs/1 (7).svg", "output_svgs/1 (8).svg", "output_svgs/1 (9).svg",
    "output_svgs/1 (10).svg", "output_svgs/1 (11).svg", "output_svgs/1 (12).svg",
    "output_svgs/1 (13).svg", "output_svgs/1 (14).svg", "output_svgs/1 (15).svg",
    "output_svgs/1 (16).svg", "output_svgs/1 (17).svg", "output_svgs/1 (18).svg",
    "output_svgs/1 (19).svg", "output_svgs/1 (20).svg", "output_svgs/1 (21).svg",
    "output_svgs/1 (22).svg", "output_svgs/1 (23).svg", "output_svgs/1 (24).svg",
    "output_svgs/1 (25).svg"
];


      images.forEach(image => {
          const cell = document.createElement("div");
          cell.className = "cell";
          cell.innerHTML = `<img width="56" height="56" src="${image}" style="pointer-events: none;">`;
          cellsBoard.appendChild(cell);
      });

      addCellClickAnimation();
  }

  populateBoard();
});
