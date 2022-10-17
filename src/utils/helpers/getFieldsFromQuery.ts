import { BadRequestException } from '@nestjs/common';
import { EntityManager, EntityName } from '@mikro-orm/core';
import { entityDictionary } from './entityDictionary';

export type NestedField = { [key: string]: string[] };

export const getFieldsFromQuery = (
  selectParams: string[],
  nestedParams: string[],
  em: EntityManager,
  currentEntity: string,
): (string | NestedField)[] => {
  const nestedFields: NestedField[] = [];

  selectParams.forEach((param) => {
    if (
      !em.canPopulate(
        entityDictionary[currentEntity] as EntityName<object>,
        param,
      )
    )
      throw new BadRequestException(`${param} is not a known field`);
  });

  nestedParams.forEach((nestedParam) => {
    const option: NestedField = {};
    const [entity, property] = nestedParam.split('.');

    if (
      !em.canPopulate(entityDictionary[entity] as EntityName<object>, property)
    )
      throw new BadRequestException(
        `${property} is not a known field for ${entity}`,
      );

    if (!selectParams.includes(entity))
      throw new BadRequestException(
        `${entity} missing in the select query params`,
      );

    const foundNestedField = nestedFields.find(
      (nestedField) => entity in nestedField,
    );

    if (foundNestedField) {
      foundNestedField[entity].push(property);
      return;
    }

    option[entity] = [property];
    nestedFields.push(option);
  });

  return [...selectParams, ...nestedFields];
};
