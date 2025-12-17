const images = [
    {
        preview: 'https://placehold.co/300x200',
        original: 'https://placehold.co/1200x800',
        description: 'Перше зображення',
    },
    {
        preview: 'https://placehold.co/300x200/orange/white',
        original: 'https://placehold.co/1200x800/orange/white',
        description: 'Друге зображення',
    },
    {
        preview: 'https://placehold.co/300x200/blue/white',
        original: 'https://placehold.co/1200x800/blue/white',
        description: 'Третє зображення',
    },
];

// Створюємо розмітку
const gallery = document.querySelector('.gallery');

const markup = images
    .map(
        (img) => `
      <li class="gallery-item">
        <img 
          src="${img.preview}" 
          data-source="${img.original}" 
          alt="${img.description}" 
        />
      </li>
    `
    )
    .join('');

gallery.innerHTML = markup;

// Делегування подій
gallery.addEventListener('click', (event) => {
    const clickedImg = event.target;

    if (clickedImg.nodeName !== 'IMG') return;

    const largeImg = clickedImg.dataset.source;

    // Показати посилання у консоль (вимога пункту 11)
    console.log(largeImg);

    // Модальне вікно
    const instance = basicLightbox.create(`
      <img src="${largeImg}" width="900" height="600"  alt=""/>
  `);

    instance.show();
});
