const bcrypt = require('bcryptjs');

// This is the plain password you're testing
const plainPassword = 'Admin@679';

// This is the hashed password from your database
const storedHashedPassword = '$2b$10$GgUQ7zgcSv9K36R93zuZbuyn4n228X5dREX9VfHKWGV1h37aUlSYq';

bcrypt.compare(plainPassword, storedHashedPassword).then(match => {
  console.log("Password match:", match); // Should print true if valid
});
