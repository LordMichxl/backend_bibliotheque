import { Book, Category } from './models/index.js';
import { sequelize } from './models/index.js';

const seedBooks = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection is established successfully.');

    // Optionnel : vérifier qu'il y a au moins une catégorie
    const categories = await Category.findAll();
    if (categories.length === 0) {
      console.log('Aucune catégorie trouvée. Ajoutez une catégorie avant de seed les livres.');
      return;
    }

    const sampleBooks = [
      {
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        isbn: '9780156012195',
        description: "Un classique de la littérature française sur l'amitié et l'enfance.",
        quantity: 10,
        available_quantity: 10,
        category_id: categories[0].id,
        cover_image: 'le-petit-prince.jpg'
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        description: 'Roman dystopique sur un régime totalitaire et la surveillance.',
        quantity: 8,
        available_quantity: 8,
        category_id: categories[0].id,
        cover_image: '1984.jpg'
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        description: 'Guide vers un code plus maintenable et de meilleure qualité.',
        quantity: 5,
        available_quantity: 5,
        category_id: categories[0].id,
        cover_image: 'clean-code.jpg'
      }
    ];

    for (const b of sampleBooks) {
      const [book, created] = await Book.findOrCreate({
        where: { isbn: b.isbn },
        defaults: b
      });
      console.log(`${created ? 'Créé' : 'Existant'} : ${book.title}`);
    }

    console.log('Seed des livres terminé.');
  } catch (err) {
    console.error('Erreur de seed :', err);
  } finally {
    await sequelize.close();
  }
};

seedBooks();