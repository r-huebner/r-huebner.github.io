function getProjectLabelsForSection(section) {
    const projectLabels = section.querySelectorAll('.project-label');
    const labelCount = {};

    projectLabels.forEach(label => {
        const labelText = label.innerText;

        if (labelCount[labelText]) {
            labelCount[labelText]++;
        } else {
            labelCount[labelText] = 1;
        }
    });

    return labelCount;
}

function createHistogram(chartContainer) {
    const section = chartContainer.closest('.section');
    const labelCount = getProjectLabelsForSection(section);
    const ctx = chartContainer.querySelector('canvas').getContext('2d');
    const highestValue = Math.max(...Object.values(labelCount));
    const dataValues = Object.values(labelCount);
    const dataLabels = Object.keys(labelCount);

    // Define different colors for each label using hex codes
    const labelColors = {
'Web Application': '#a78b5c',
        'Desktop Application': '#4D6F46',
        'Machine Learning': '#bcd87c',
    };

    const datasetColors = dataLabels.map(label => labelColors[label] || '#FF5722'); // Default color if label not found

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataLabels,
            datasets: [{
                label: 'Number of Projects',
                data: dataValues,
                backgroundColor: datasetColors,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Total Projects: ${dataValues.reduce((a, b) => a + b, 0)}`,
                    font: {
                        family: 'Noto Sans',
                        size: 16
                    }
                },
                legend: {
                    display: false // Hide the legend
                },
                tooltip: {
                    enabled: false // Disable tooltips
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: highestValue + 1, // Set y-axis max to highest value + 2
                    grid: {
                        display: false // Hide grid lines
                    },
                    ticks: {
                        display: true, // Show y-axis labels
                        font: {
                            family: 'Noto Sans',
                            size: 12
                        },
                        callback: function(value, index, values) {
                            // Hide labels that are not integers
                            return Number.isInteger(value) ? value : '';
                        }
                    },
                    title: {
                        display: true,
                        text: 'Number of Projects',
                        font: {
                            family: 'Noto Sans',
                            size: 14
                        }
                    }
                },
                x: {
                    grid: {
                        display: false // Hide vertical grid lines
                    },
                    ticks: {
                        display: true, // Show x-axis labels
                        font: {
                            family: 'Noto Sans',
                            size: 12
                        }
                    }
                    
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Select all sections
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        const filterToggle = section.querySelector('.filter-toggle');
        const filterIcons = section.querySelector('.filter-icons');
        const projectCards = section.querySelectorAll('.project-card');

        // Ensure filterToggle exists before adding event listeners
        if (filterToggle && filterIcons) {
            // Show/Hide filter icons on toggle button click
            filterToggle.addEventListener('click', () => {
                filterIcons.classList.toggle('show');
            });

            // Toggle selected class on filter icons when clicked
            filterIcons.addEventListener('click', (event) => {
                if (event.target.classList.contains('filter-icon')) {
                    event.target.classList.toggle('selected'); // Toggle selected class
                    applyFilter();
                }
            });

            function applyFilter() {
                const selectedFilters = Array.from(filterIcons.querySelectorAll('.filter-icon.selected'))
                    .map(icon => icon.dataset.filter);

                projectCards.forEach(card => {
                    const cardTags = card.dataset.tags.split(' ');

                    const shouldShow = selectedFilters.every(filter => cardTags.includes(filter));

                    if (selectedFilters.length === 0 || shouldShow) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            }
        }

    });

    // Find all chart containers with projectHistogram class
    const chartContainers = document.querySelectorAll('.chart-container');

    chartContainers.forEach(chartContainer => {
        // Create histogram for the chart container
        createHistogram(chartContainer);
    });
});