'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

class User extends Model {
  async validPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O primeiro nome é obrigatório'
      }
    }
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O sobrenome é obrigatório'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Este email já está cadastrado'
    },
    validate: {
      isEmail: {
        msg: 'Por favor, insira um email válido'
      },
      notEmpty: {
        msg: 'O email é obrigatório'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'A senha deve ter entre 6 e 100 caracteres'
      }
    }
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;
