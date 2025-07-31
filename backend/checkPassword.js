const bcrypt = require('bcryptjs');

const plainPassword = 'Admin@679'; // Make sure no space before/after
const storedHash = '$2b$10$GgUQ7zgcSv9K36R93zuZbuyn4n228X5dREX9VfHKWGV1h37aUlSYq';

bcrypt.compare(plainPassword, storedHash).then((isMatch) => {
  console.log("✅ Password match:", isMatch);
});
