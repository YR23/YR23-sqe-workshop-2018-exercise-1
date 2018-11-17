import assert from 'assert';
import * as parser from '../src/js/code-analyzer';

//* Helping Function */
function CountForMe(result,type_checker)
{
    var counter =0;
    for (var i=0;i<result.length;i++)
        if (result[i].type===type_checker) 
            counter++;
    return counter;
}
/* End of Helping Functions*/

    describe('The javascript parser', () => {
        it('is parsing an empty function correctly', () => {
            assert.equal(
                JSON.stringify(parser.parseCode('')),
                '{"type":"Program","body":[],"sourceType":"script"}'
            );
        });

        it('is parsing a simple variable declaration correctly', () => {
            assert.equal(
                JSON.stringify(parser.parseCode('let a = 1;')),
                '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
            );
        });

    });

    

    describe('cheking while loop', () => {
    var TestedInput = 
             `function optin1(){
                while (low <= high) 
                {
                                let num;
                                 num = 1;
                                mid = (low + high)/2;
                                if (X < V[mid])
                                {
                                    num = 1;
                                    high = mid - 1;
                                }
                                else if (X > V[mid])
                                    low = mid + 1;
                                else
                                    return mid;
                }
                return -1;}`
        let parsedCode = parser.parseCode(TestedInput);
        var result = parser.ParseDataToTable(parsedCode);
    it('total', () => {         
        assert.equal(result.length,13);
    });
    it('count var dec', () => {         
        var count_variable_declaration = CountForMe(result,"variable declaration");
        assert.equal(count_variable_declaration,1); 
    }); 
    it('count ass exp', () => {         
        var count_assignment_expression = CountForMe(result,"assignment expression");
        assert.equal(count_assignment_expression,5);
    }); 
    var TestedInput = 
    `function optin1(){
       while (low <= high) 
       {
                       let num;
                        num = 1;
                       mid = (low + high)/2;
                       if (X < V[mid])
                       {
                           num = 1;
                           high = mid - 1;
                       }
                       else if (X > V[mid])
                           low = mid + 1;
                       else
                           return mid;
       
       return 1;`
       it('checking bad input', () => {         
       try{
        parser.parseCode(TestedInput);
       }
       catch(e)
       {
        assert.equal(e.message,"Line 17: Unexpected end of input");
       }
    }); 
        //var result = parser.ParseDataToTable(parsedCode);
    });

    describe('cheking for loop', () => {
        var TestedInput = 
                `function yarden(){
                    let noam = 0;
                    for (let i=0;i<10;i++)
                    {
                        if (a=5)
                        {
                            let yarden=2
                            return ;
                        }
                        else
                        {
                            let yuval = 3;
                            return 7;
                        }
                    }
                    return x + y;
                }`
            let parsedCode = parser.parseCode(TestedInput);
            var result = parser.ParseDataToTable(parsedCode);
        it('total', () => {         
            assert.equal(result.length,11);
        });
        it('count for loops', () => {         
            var count = CountForMe(result,"if statement");
            assert.equal(count,1); 
        }); 
        it('count return exp', () => {         
            var count = CountForMe(result,"return statement");
            assert.equal(count,3);
        }); 
        
        var TestedInput = 
        `function yarden(){
            let noam = 0;
            for (let i=0;i<10;i++)
            {
                if (a=5)
                {
                    let yarden=2
                    return ;
                }
                else
                {
                    let yuval = 3;
                    return 7;
                }
            }
            return x + y;
        `
        it('checking bad input', () => {         
        try{
            parser.parseCode(TestedInput);
        }
        catch(e)
        {
            assert.equal(e.message,"Line 17: Unexpected end of input");
        }
        }); 
            //var result = parser.ParseDataToTable(parsedCode);
    });
/*
    describe('Checking Option 3', () => {
        it('Option 1', () => {
            var TestedInput = `function binarySearch(X, V, n){
                let low, high, mid;
                low = 0;
                high = n - 1;
                while (low <= high) {
                    mid = (low + high)/2;
                    if (X < V[mid])
                        high = mid - 1;
                    else if (X > V[mid])
                        low = mid + 1;
                    else
                        return mid;
                }
                return -1;
            }`
            let parsedCode = parser.parseCode(TestedInput);
            //console.log(parsedCode);
            var result = parser.ParseDataToTable(parsedCode);
            assert.equal(
                result.length,
                18
            );
            
        }); 
    });

*/
    describe('cheking If statment', () => {
        var TestedInput = 
                `function yarden (x)
                {
                if (1<2)
                {
                  if(2<3)
                {
                   if (3<4)
                {
                }
                else if (4<5)
                {
                }
                else
                {
                }
                }
                
                }
                else
                {
                }
                return yarden;
                }`
            let parsedCode = parser.parseCode(TestedInput);
            var result = parser.ParseDataToTable(parsedCode);
        it('total', () => {         
            assert.equal(result.length,9);
        });
        it('count ifim', () => {         
            var count = CountForMe(result,"if statement");
            assert.equal(count,3); 
        }); 
        it('count else ifim', () => {         
            var count = CountForMe(result,"else if statement");
            assert.equal(count,1);
        }); 
        it('count elseim', () => {         
            var count = CountForMe(result,"else statement");
            assert.equal(count,2);
        }); 
        
        var TestedInput = 
        `function yarden (x)
        {
        if (1<2)
        
          if(2<3)
        {
           if (3<4)
        {
        }
        else if (4<5)
        {
        }
        else
        {
        }
        }
        
        }
        else
        {
        }
        return -1;
        }
        `
        it('checking bad input', () => {         
        try{
            parser.parseCode(TestedInput);
        }
        catch(e)
        {
            assert.equal(e.message,"Line 19: Unexpected token else");
        }
        }); 
            //var result = parser.ParseDataToTable(parsedCode);
    });

    describe('cheking Assignment Expression', () => {
        var TestedInput = 
                `function yarden (x)
                {
                a=5;
                a=a+b;
                a=a+c+b;
                return yarden;
                }`
            let parsedCode = parser.parseCode(TestedInput);
            var result = parser.ParseDataToTable(parsedCode);
        it('total', () => {         
            assert.equal(result.length,6);
        });
        it('count assignmentim', () => {         
            var count = CountForMe(result,"assignment expression");
            assert.equal(count,3); 
        }); 
        
        var TestedInput = 
        `function yarden (x)
        {
        a'===5;
        a=a+b;
        a=a+c+b;
        return yarden;
        }
        `
        it('checking bad input', () => {         
        try{
            parser.parseCode(TestedInput);
        }
        catch(e)
        {
            assert.equal(e.message,"Line 3: Unexpected token ILLEGAL");
        }
        }); 
            //var result = parser.ParseDataToTable(parsedCode);
    });
