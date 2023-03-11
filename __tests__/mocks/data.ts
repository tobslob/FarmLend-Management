import faker from 'faker';
import _ from 'lodash';
import { Users } from '../../src/services/user';
import { OrganizationType } from "../../src/data/models/organization.model";
import { OrderType } from '../../src/data/models/order.model';

export class FakeData {
    randomString = faker.random.word();
    randomNumber = faker.datatype.number();
    randomEmail = faker.internet.email();
    randomCompany = faker.company.companyName();
    randomPassword = faker.internet.password();
    randomOrganizationType = _.sample(Object.values(OrganizationType)) as OrganizationType;
    OrderType = _.sample(Object.values(OrderType)) as OrderType;
    guid = faker.datatype.uuid()

    createProduct() {
        return {
            category: this.randomString,
            variety: this.randomString,
            packaging: this.randomString,
            volume: this.randomNumber,
            pricePerUnit: this.randomNumber
        }
    }

    createOrganization() {
        return {
            name: this.randomString,
            type: OrganizationType.SELLER
        }
    }

    createOrder(productId: string) {
        return {
            name: this.randomString,
            type: this.OrderType,
            references: this.guid,
            products: [{
                productId: productId,
                volume: this.randomNumber
            }]
        }
    }

    async testerUser() {
        return await Users.createUser({
            firstName: this.randomString,
            lastName: this.randomString,
            emailAddress: this.randomEmail,
            password: this.randomPassword,
            organizationName: this.randomCompany,
            organizationType: this.randomOrganizationType
        })
    }
}