import { seedTestDatabase } from "./seed";

seedTestDatabase().then(() => {
    console.log('Database seeded');
})
.catch((err) => {
    console.log(err);
})