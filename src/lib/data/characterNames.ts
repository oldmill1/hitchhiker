// Character names from American fiction, movies, TV shows, and novels

const characterNames: string[] = [
  // Classic Literature
  'Atticus Finch',
  'Huckleberry Finn',
  'Tom Sawyer',
  'Jay Gatsby',
  'Holden Caulfield',
  'Scout Finch',
  'Hester Prynne',
  'Natty Bumppo',
  'Ishmael',
  'Captain Ahab',
  
  // Modern Literature
  'Harry Potter',
  'Katniss Everdeen',
  'Tyler Durden',
  'Lisbeth Salander',
  'Jack Reacher',
  
  // Superheroes & Comics
  'Tony Stark',
  'Peter Parker',
  'Bruce Wayne',
  'Clark Kent',
  'Diana Prince',
  'Steve Rogers',
  'Natasha Romanoff',
  'Wade Wilson',
  'Logan',
  'Ororo Munroe',
  
  // TV Shows
  'Walter White',
  'Jesse Pinkman',
  'Don Draper',
  'Rick Grimes',
  'Daryl Dixon',
  'Tyrion Lannister',
  'Jon Snow',
  'Daenerys Targaryen',
  'Michael Scott',
  'Dwight Schrute',
  'Leslie Knope',
  'Ron Swanson',
  'Dexter Morgan',
  'Carrie Mathison',
  'Olivia Benson',
  
  // Movies
  'Forrest Gump',
  'Indiana Jones',
  'Ellen Ripley',
  'John McClane',
  'Sarah Connor',
  'Marty McFly',
  'Doc Brown',
  'Luke Skywalker',
  'Han Solo',
  'Princess Leia',
  'Elliot Ness',
  'Clarice Starling',
  'Hannibal Lecter',
  'Jack Sparrow',
  'Neo',
  'Trinity',
  'Morpheus',
  'John Wick',
  'Ethan Hunt',
  'James Bond'
];

/**
 * Returns a random character name from the collection
 */
export function getRandomCharacterName(): string {
  const randomIndex = Math.floor(Math.random() * characterNames.length);
  return characterNames[randomIndex];
}

