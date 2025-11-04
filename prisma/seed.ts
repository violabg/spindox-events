import 'dotenv/config';
import { PrismaClient } from '../src/prisma/client';
import { ContestStatus } from '../src/prisma/enums';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create a sample contest
  const contest = await prisma.contest.create({
    data: {
      name: 'JavaScript Fundamentals Quiz',
      slug: 'javascript-fundamentals',
      theme: 'Programming',
      description: 'Test your knowledge of JavaScript fundamentals including variables, functions, and control structures.',
      status: ContestStatus.active,
    },
  });

  console.log(`Created contest: ${contest.name} (ID: ${contest.id})`);

  // Create sample questions for the contest
  const questions = [
    {
      title: 'Variable Declaration',
      content: 'Which of the following is the correct way to declare a variable in modern JavaScript?',
      order: 1,
      answers: [
        { content: 'var myVariable = "hello";', score: 0, order: 1 },
        { content: 'let myVariable = "hello";', score: 10, order: 2 },
        { content: 'const myVariable = "hello";', score: 10, order: 3 },
        { content: 'variable myVariable = "hello";', score: 0, order: 4 },
      ],
    },
    {
      title: 'Function Syntax',
      content: 'What is the modern ES6+ syntax for creating an arrow function?',
      order: 2,
      answers: [
        { content: 'function() => { return value; }', score: 0, order: 1 },
        { content: '() => { return value; }', score: 10, order: 2 },
        { content: '=> { return value; }', score: 0, order: 3 },
        { content: 'arrow() { return value; }', score: 0, order: 4 },
      ],
    },
    {
      title: 'Array Methods',
      content: 'Which array method creates a new array with all elements that pass a test?',
      order: 3,
      answers: [
        { content: 'array.forEach()', score: 0, order: 1 },
        { content: 'array.map()', score: 5, order: 2 },
        { content: 'array.filter()', score: 10, order: 3 },
        { content: 'array.reduce()', score: 0, order: 4 },
      ],
    },
    {
      title: 'Object Destructuring',
      content: 'What is the correct syntax for destructuring an object in JavaScript?',
      order: 4,
      answers: [
        { content: 'const [name, age] = person;', score: 0, order: 1 },
        { content: 'const {name, age} = person;', score: 10, order: 2 },
        { content: 'const (name, age) = person;', score: 0, order: 3 },
        { content: 'const name, age = person;', score: 0, order: 4 },
      ],
    },
    {
      title: 'Async/Await',
      content: 'How do you properly handle errors when using async/await?',
      order: 5,
      answers: [
        { content: 'Use .catch() method', score: 5, order: 1 },
        { content: 'Use try/catch block', score: 10, order: 2 },
        { content: 'Use .then() method', score: 0, order: 3 },
        { content: 'Errors are handled automatically', score: 0, order: 4 },
      ],
    },
  ];

  // Create questions and their answers
  for (const questionData of questions) {
    const question = await prisma.question.create({
      data: {
        title: questionData.title,
        content: questionData.content,
        order: questionData.order,
        contestId: contest.id,
      },
    });

    console.log(`Created question: ${question.title} (ID: ${question.id})`);

    // Create answers for this question
    for (const answerData of questionData.answers) {
      const answer = await prisma.answer.create({
        data: {
          content: answerData.content,
          score: answerData.score,
          order: answerData.order,
          questionId: question.id,
        },
      });

      console.log(`  - Created answer: ${answer.content} (Score: ${answer.score})`);
    }
  }

  console.log('Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
