package factory

import (
	"github.com/dorianneto/codepix/application/usecase"
	"github.com/dorianneto/codepix/infrastructure/repository"
	"github.com/jinzhu/gorm"
)

func TransactionUseCase(database *gorm.DB) usecase.TransactionUseCase {
	pixRepository := repository.PixKeyRepositoryDb{Db: database}
	transactionRepository := repository.TransactionRepositoryDb{Db: database}

	transactionUseCase := usecase.TransactionUseCase{
		TransactionRepository: transactionRepository,
		PixKeyRepository:      pixRepository,
	}

	return transactionUseCase
}
