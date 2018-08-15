import { isThrowStatement, isTypeFlagSet } from "tsutils";
import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.TypedRule {
    /* tslint:disable:object-literal-sort-keys */
    public static metadata: Lint.IRuleMetadata = {
        ruleName: "strict-error-throw",
        description: Lint.Utils.dedent`
            Restricts that only instances or subclasses of \`Error\` be thrown.`,
        descriptionDetails: Lint.Utils.dedent`
            Example – Doing it right

            \`\`\`ts
            throw new Error("message");

            class Exception extends Error {
                // ...
            }
            const exception = new Exception("message");
            throw exception;
            \`\`\`

            Example – Anti Pattern

            \`\`\`ts
            throw "error";

            throw { message: "error" };

            class MyError {
                // ...
            }
            throw new MyError();
            \`\`\`

            This rule is stricter than \`no-string-throw\`.
            You can disable \`no-string-throw\` when you have enabled \`strict-error-throw\`.
            `,
        optionsDescription: "Not configurable.",
        options: null,
        optionExamples: [true],
        rationale: Lint.Utils.dedent`
            It is considered good practice to only throw the \`Error\` object itself
            or an object using the \`Error\` object as base objects for user-defined exceptions.
            The fundamental benefit of \`Error\` objects is that they automatically keep track
            of where they were built and originated.`,
        type: "functionality",
        typescriptOnly: true,
        requiresTypeInfo: true,
    };
    /* tslint:enable:object-literal-sort-keys */

    public static FAILURE_STRING = "Expected an instance of 'Error' or its subclass to throw";

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
    }
}

function walk(ctx: Lint.WalkContext<void>, checker: ts.TypeChecker) {
    return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
        if (isThrowStatement(node)) {
            const type = checker.getTypeAtLocation(node.expression);
            if (!isTypeFlagSet(type, ts.TypeFlags.Any) && !isInstanceOfClass(type, "Error")) {
                ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
            }
        }
        return ts.forEachChild(node, cb);
    });

    function isInstanceOfClass(type: ts.Type, className: string) {
        if (isTypeFlagSet(type, ts.TypeFlags.Object)) {
            if (type.symbol!.name === className) {
                return true;
            } else {
                const baseTypes = type.getBaseTypes();
                if (baseTypes !== undefined) {
                    for (const baseType of baseTypes) {
                        if (isInstanceOfClass(baseType, className)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
}
