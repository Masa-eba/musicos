import * as cdk from 'aws-cdk-lib';
import { CorsHttpMethod, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import {
  AccountRecovery,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'node:path';

export class MusicOSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const activitiesTable = new Table(this, 'ActivitiesTable', {
      tableName: 'Activities',
      partitionKey: {
        name: 'userId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'activityId',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPool = new UserPool(this, 'UserPool', {
      userPoolName: 'MusicOSUserPool',
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = new UserPoolClient(this, 'UserPoolClient', {
      userPool,
      userPoolClientName: 'MusicOSAppClient',
      generateSecret: false,
      disableOAuth: true,
      authFlows: {
        userSrp: true,
        userPassword: true,
      },
    });

    const createActivityFunction = new NodejsFunction(this, 'CreateActivityFunction', {
      functionName: 'CreateActivityFunction',
      entry: join(__dirname, '../lambda/create-activity/index.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: activitiesTable.tableName,
      },
      bundling: {
        bundleAwsSDK: true,
        minify: true,
        sourceMap: true,
      },
    });

    const getActivitiesFunction = new NodejsFunction(this, 'GetActivitiesFunction', {
      functionName: 'GetActivitiesFunction',
      entry: join(__dirname, '../lambda/get-activities/index.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: activitiesTable.tableName,
      },
      bundling: {
        bundleAwsSDK: true,
        minify: true,
        sourceMap: true,
      },
    });

    createActivityFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:PutItem'],
        resources: [activitiesTable.tableArn],
      }),
    );

    getActivitiesFunction.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['dynamodb:Query'],
        resources: [activitiesTable.tableArn],
      }),
    );

    const activitiesApi = new HttpApi(this, 'ActivitiesApi', {
      apiName: 'MusicOSActivitiesApi',
      corsPreflight: {
        allowHeaders: ['content-type'],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST],
        allowOrigins: ['*'],
      },
    });

    activitiesApi.addRoutes({
      path: '/activities',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        'CreateActivityIntegration',
        createActivityFunction,
      ),
    });

    activitiesApi.addRoutes({
      path: '/activities',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('GetActivitiesIntegration', getActivitiesFunction),
    });

    new cdk.CfnOutput(this, 'ActivitiesTableName', {
      value: activitiesTable.tableName,
    });

    new cdk.CfnOutput(this, 'ActivitiesTableArn', {
      value: activitiesTable.tableArn,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: activitiesApi.apiEndpoint,
    });

    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });
  }
}
