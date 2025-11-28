const db = require("../app/models");
const Role = db.role;

async function setupDatabase() {
  try {
    await db.sequelize.sync({ force: false });
    console.log('Database synchronized successfully');

    await Role.findOrCreate({
      where: { id: 1 },
      defaults: { name: "user" }
    });
    
    await Role.findOrCreate({
      where: { id: 2 },
      defaults: { name: "admin" }
    });

    console.log('Default roles created');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();