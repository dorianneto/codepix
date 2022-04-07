package repository

import (
	"fmt"

	"github.com/dorianneto/codepix/domain/model"
	"github.com/jinzhu/gorm"
)

type TransactionRepositoryDb struct {
	Db *gorm.DB
}

func (repository TransactionRepositoryDb) Register(transaction *model.Transaction) error {
	err := repository.Db.Create(transaction).Error

	if err != nil {
		return err
	}

	return nil
}

func (repository TransactionRepositoryDb) Save(transaction *model.Transaction) error {
	err := repository.Db.Save(transaction).Error

	if err != nil {
		return err
	}

	return nil
}

func (repository PixKeyRepositoryDb) Find(id string) (*model.Transaction, error) {
	var transaction model.Transaction

	repository.Db.Preload("AccountFrom.Bank").First(&transaction, "id = ?", id)

	if transaction.ID == "" {
		return nil, fmt.Errorf("no transaction was found")
	}

	return &transaction, nil
}
