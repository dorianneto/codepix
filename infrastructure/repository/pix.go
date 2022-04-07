package repository

import (
	"fmt"

	"github.com/dorianneto/codepix/domain/model"
	"github.com/jinzhu/gorm"
)

type PixKeyRepositoryDb struct {
	Db *gorm.DB
}

func (repository PixKeyRepositoryDb) AddBank(bank *model.Bank) error {
	err := repository.Db.Create(bank).Error

	if err != nil {
		return err
	}

	return nil
}

func (repository PixKeyRepositoryDb) AddAccount(account *model.Account) error {
	err := repository.Db.Create(account).Error

	if err != nil {
		return err
	}

	return nil
}

func (repository PixKeyRepositoryDb) RegisterKey(pixKey *model.PixKey) error {
	err := repository.Db.Create(pixKey).Error

	if err != nil {
		return err
	}

	return nil
}

func (repository PixKeyRepositoryDb) FindKeyByKind(key string, kind string) (*model.PixKey, error) {
	var pixKey model.PixKey

	repository.Db.Preload("Account.Bank").First(&pixKey, "kind = ? and key = ?", kind, key)

	if pixKey.ID == "" {
		return nil, fmt.Errorf("no key was found")
	}

	return &pixKey, nil
}

func (repository PixKeyRepositoryDb) FindAccount(id string) (*model.Account, error) {
	var account model.Account

	repository.Db.Preload("Bank").First(&account, "id = ?", id)

	if account.ID == "" {
		return nil, fmt.Errorf("no account found")
	}

	return &account, nil
}

func (repository PixKeyRepositoryDb) FindBank(id string) (*model.Bank, error) {
	var bank model.Bank

	repository.Db.First(&bank, "id = ?", id)

	if bank.ID == "" {
		return nil, fmt.Errorf("no bank found")
	}

	return &bank, nil
}
