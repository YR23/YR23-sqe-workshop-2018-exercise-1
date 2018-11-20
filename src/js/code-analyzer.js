import * as esprima from 'esprima';

var line_num=1;
var result = [];
var converter;


const parseCode = (codeToParse) => {
    line_num =1 ;
    result = [];
    CreateConverter();
    return esprima.parseScript(codeToParse);
};

function CreateConverter()
{
    converter = new Map();
    converter.set('FunctionDeclaration','function Declaration');
    converter.set('Identifier','variable declaration');
    converter.set('VariableDeclarator','variable declaration');
    converter.set('AssignmentExpression', 'assignment expression');
    converter.set('WhileStatement', 'while statement');
    converter.set('IfStatement', 'if statement');
    converter.set('ElseIfStatement', 'else if statement');
    converter.set('ElseStatement','else statement');
    converter.set('ReturnStatement','return statement');
    converter.set('ForStatement','for statement');

}


function CotinueSwitchCase4(expression) {
    switch (expression.type) {
    case('UnaryExpression'):
        return ParseUnaryExpression(expression);
    case('ForStatement'):
        ParseForStatement(expression);
        break;
    }
}

function CotinueSwitchCase3(expression) {
    switch (expression.type)
    {
    case('MemberExpression'):
        return ParseMemberExpression(expression);
    case('ElseIfStatement'):
        ParseIfStatement(expression);
        break;
    case('ReturnStatement'):
        ParseReturnStatement(expression);
        break;
    default:
        return CotinueSwitchCase4(expression);}
}

function CotinueSwitchCase2(expression) {
    switch (expression.type)
    {
    case('Literal'):
        return ParseLiteral(expression);
    case('BinaryExpression'):
        return ParseBinaryExpression(expression);
    case('WhileStatement'):
        ParseWhileStatement(expression);
        break;
    case('IfStatement'):
        ParseIfStatement(expression);
        break;
    default:
        return CotinueSwitchCase3(expression);}
}

function CotinueSwitchCase(expression) {
    switch (expression.type)
    {
    case('VariableDeclarator'):
        ParseVariableDeclarator(expression);
        break;
    case('ExpressionStatement'):
        ParseExpressionStatement(expression);
        break;
    case('AssignmentExpression'):
        ParseAssignmentExpression(expression);
        break;
    case('Identifier'):
        return ParseIdentifier(expression);
    default:
        return CotinueSwitchCase2(expression);}
}
    


/*



 */
function ParseDataToTable(expression)
{
    switch (expression.type)
    {
    case ('Program'):
        ParseProgram(expression);
        return result;
    case ('FunctionDeclaration'):
        ParseFunction(expression);
        break;
    case('BlockStatement'):
        ParseBlockStatement(expression);
        break;
    case('VariableDeclaration'):
        ParseVariableDeclaration(expression);
        break;
    default:
        return CotinueSwitchCase(expression);}

}
  

function ParseProgram(expression)
{
    ParseDataToTable(expression.body[0]);
    return result;
    
}

function ParseFunction(expression)
{
    result.push(
        {'line':line_num,
            'type':converter.get(expression.type), 'name':expression.id.name, 'condition':'', 'value':''
        });
    var params = expression.params;
    for (var i = 0;i<params.length;i++)
        result.push(
            {'line':line_num,
                'type':converter.get(params[i].type), 'name':params[i].name, 'condition':'', 'value':''
            });

    line_num++;
    ParseDataToTable(expression.body);
}

function ParseBlockStatement(expression)
{
    for (var i=0;i<expression.body.length;i++)
    {
        
        ParseDataToTable(expression.body[i]);
        line_num++;
    }
}

function ParseVariableDeclaration(expression)
{
    for (var i=0;i<expression.declarations.length;i++)
    {
        ParseDataToTable(expression.declarations[i]);
    }
}

function ParseVariableDeclarator(expression)
{
    result.push(
        {'line':line_num,
            'type':converter.get(expression.type),
            'name':expression.id.name,
            'condition':'',
            'value':''
        });
}

function ParseExpressionStatement(expression)
{
    ParseDataToTable(expression.expression);
}

function ParseAssignmentExpression(expression)
{
    var name = ParseDataToTable(expression.left);
    var value = ParseDataToTable(expression.right);
    result.push(
        {'line':line_num,
            'type':converter.get(expression.type),
            'name':name,
            'condition':'',
            'value':value
        });
}

function ParseIdentifier(expression)
{
    return expression.name;
}

function ParseLiteral(expression)
{
    return expression.value;
}

function ParseBinaryExpression(expression)
{
    var name = ParseDataToTable(expression.left);
    var operator = expression.operator; 
    var value = ParseDataToTable(expression.right);
    return name+operator+value;
}

function ParseWhileStatement(expression)
{
    var condition = ParseDataToTable(expression.test);
    result.push(
        {'line':line_num,
            'type':converter.get(expression.type),
            'name':'',
            'condition':condition,
            'value':''
        });
    line_num++;
    ParseDataToTable(expression.body);
}

function ParseIfStatement(expression)
{
    var condition = ParseDataToTable(expression.test);
    result.push({'line':line_num, 'type':converter.get(expression.type), 'name':'', 'condition':condition, 'value':''});
    line_num++;
    ParseDataToTable(expression.consequent);
    line_num++;
    if (expression.alternate != null)
    {
        if (expression.alternate.type==='IfStatement') {
            expression.alternate.type= 'ElseIfStatement';
            ParseDataToTable(expression.alternate);}
        else {
            result.push({'line':line_num, 'type':'else statement', 'name':'', 'condition':'', 'value':''});
            line_num++;
            ParseDataToTable(expression.alternate);}
    }
}

function ParseMemberExpression(expression)
{
    return ParseDataToTable(expression.object) +'[' + ParseDataToTable(expression.property) + ']';
}

function ParseReturnStatement(expression)
{
    var ret;
    if (expression.argument!=null)
        ret = ParseDataToTable(expression.argument);
    else
        ret = '';
    result.push(
        {'line':line_num,
            'type':converter.get(expression.type),
            'name':'',
            'condition':'',
            'value':ret
        });
    line_num--;
}

function ParseUnaryExpression(expression)
{
    return expression.operator + ParseDataToTable(expression.argument);
}

function ParseForStatement(expression)
{
    var condition = ParseDataToTable(expression.test);
    result.push(
        {'line':line_num,
            'type':converter.get(expression.type),
            'name':'',
            'condition':condition,
            'value':''
        });
    line_num++;
    ParseDataToTable(expression.body);
}

export {parseCode,ParseDataToTable,CreateConverter,
    ParseProgram,ParseFunction,ParseBlockStatement,
    ParseVariableDeclaration,ParseVariableDeclarator,ParseExpressionStatement,
    ParseAssignmentExpression,ParseIdentifier,ParseLiteral,
    ParseBinaryExpression,ParseWhileStatement,ParseIfStatement,
    ParseMemberExpression,ParseReturnStatement,ParseUnaryExpression,
    
};
