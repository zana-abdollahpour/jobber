import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsObject } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class ExecuteJobInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => GraphQLJSON)
  @IsNotEmpty()
  data: object | object[];
}
