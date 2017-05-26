import React from 'react';
// interface for each should be roughly:
/*
  {
    title: 'string',
    prompt: ReactElement,
    winCondition: computationData => bool
  }
*/

const Code = props => (<span className="code">{props.children}</span>)

export default [
  {
    title: 'Simple Identifier',
    prompt: (
      <div>
        <p>Let's get acquainted with some basic syntax. First, type <Code>a₁</Code>. Letters followed optionally by numbers represent variables in the lambda calculus.</p>
      </div>
    ),
    winCondition: ({text}) => {
      return text === 'a₁';
    },
    winCondition: () => true,
  },
  // okay the first problem I actually care about
  {
    title: 'Application',
    prompt: (
      <div>
        <p>You just wrote a lambda expression which contains only the variable <Code>a₁</Code>, which is not currently bound to anything. In the lambda calculus, variables can be bound to functions, and variables can be applied to one another.</p>
        <p>To apply the variable <Code>b₁</Code> to the variable <Code>a₁</Code>, type in <Code>a₁b₁</Code>. This is akin to saying that we're calling the function <Code>a₁</Code> with <Code>b₁</Code> as an argument.</p>
      </div>
    ),
    winCondition: ({text}) => {
      return text === 'a₁b₁';
    },
    winCondition: () => true,
  },
  {
    title: 'Identity',
    prompt: (
      <div>
        <p>Nice! Now we'll get into lambda abstractions. Lambda abstractions represent functions in the lambda calculus. A lambda abstraction takes the form <Code>λ [arg] . [body]</Code> where [arg] is the input, and [body] is the output.</p>
        <p>Let's write the identity function; a function which takes its argument, does nothing to it, and spits it back out. In the lambda calculus, that looks something like <Code>λa.a</Code></p>
      </div>
    ),
    winCondition: ({ast}) => {
      return (
        // We could put conditions that we might like to use into lib/lambda when we need to.
        ast &&
        ast.type === "function" &&
        ast.body.type === "variable" &&
        ast.argument === ast.body.name
      );
    },
    winCondition: () => true,
  },
  {
    title: "Parentheses",
    prompt: (
      <div>
        <p>Schweet! This takes one argument a and outputs that same argument! Now go ahead and wrap the whole thing in parentheses</p>
      </div>
    ),
    winCondition: ({text, ast}) => {
      return (
        /^\s*\(.*\)\s*$/.test(text) &&
        ast &&
        ast.type === "function" &&
        ast.body.type === "variable" &&
        ast.argument === ast.body.name
      );
    },
    winCondition: () => true,
  },
  {
    title: "Baby's first β-reduction",
    prompt: (
      <div>
        <p>Perfect! In the lambda calculus, you can always wrap expressions in parentheses.</p>
        <p>Now in the same way that we can apply variables to other variables, we can apply variables to functions. Try applying <Code>b</Code> to your identity function, by writing <Code>(λa.a)b</Code>.</p>
      </div>
    ),
    winCondition: ({ast, text}) => {
      // These win conditions need work
      return text === '(λa.a)b';
      /*return (
        // We could put conditions that we might like to use into lib/lambda when we need to.
        ast &&
        ast.type === "function" &&
        ast.body.type === "token" &&
        ast.argument === ast.body.name &&
        false //because i haven't implemented this yet.
      );*/
    },
    winCondition: () => true,
  },
  {
    title: 'β-reduction function',
    prompt: (
      <div>
        <p>Nice! What happened here is your identity function took <Code>b</Code> as the input and spit it right back out. The result is in what's called <i>normal form</i>, which we'll get into a little later.</p>
        <p>Just like we can evaluate functions with variables, we can also evaluate them with other functions! Try typing <Code>(λa.a)λb.b</Code></p>
      </div>
    ),
    winCondition: ({text}) => text === '(λa.a)λb.b',
    winCondition: () => true,
  },
  {
    title: 'Bound and Free Variables',
    prompt: (
      <div>
        <p>Nice! We've probably driven the point home hard enough.</p>
        <p>It's prudent to make a distinction between bound and free variables. When a function takes an argument, every occurrence of the variable in the body of the function is <i>bound</i> to that variable.</p>
        <p>For quick example, if you've got the expression <Code>Lx.xy</Code>, the variable <Code>x</Code> is bound in the lambda expression, whereas the variable <Code>y</Code> is currently unbound. We call unbound variables like <Code>y</Code> <i>free variables</i>.</p>
        <p>Write a lambda expression with a free variable <Code>c</Code> (hint: this can be extremely simple).</p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: 'Curry',
    prompt: (
      <div>
        <p>Easy enough. In this REPL you can see what free variables are in an expression (as well as a lot of other information) by clicking the (+) that appears next to results.</p>
        <p>As you may have noticed before, lambda expressions can only take one argument, which is kind of annoying.</p>
        <p>Let's say we quite reasonably want to write a function which more than one argument. Fortunately, we can sort of get around the single argument restriction by making it so that a function returns another function, which when executed subsequently gives you the result. Make sense?</p>
        <p>In practice, this looks like <Code>λa.λb. [some expression]</Code>.</p>
      </div>
    ),
    winCondition: () => true,// anything works here.
  },
  {
    title: 'And a Dash of Sugar',
    prompt: (
      <div>
        <p>Getting the hang of it!</p>
        <p>Representing functions with multiple arguments like this is so convenient, we're going to introduce a special syntax. We'll write <Code>λab. [some expression]</Code> as shorthand for <Code>λa.λb. [some expression]</Code>. Try writing a function using that syntax!</p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: "Defining variables",
    prompt: (
      <div>
        <p>In the lambda calculus, there's no formal notion of defining variables, but you'll see lots of mathematicians define variables for convenience anyways.</p>
        <p>In this repl, we've added a basic syntax around defining variables.</p>
        <p>Try assigning I to your identity function by typing <Code>I := λa.a</Code></p>
      </div>
    ),
    winCondition: () => true,
  },
  // --- Computation ---
  {
    title: 'β reductions + α conversions',
    prompt: (
      <div>
        <p>Occasionally, we'll get into a situation where a variable that previously was unbound is suddenly bound to a variable that it shouldn't be. For example, if we tried beta-reducing <Code>(λab.ab)b</Code> without renaming, we'd get <Code>λb.bb</Code>, which is  not quite what we intended. We likely wanted <Code>b</Code> to remain a free variable.</p>
        <p>Instead, we do an alpha-conversion (fancy name for renaming variables) of the lambda expression prior to doing the beta reduction, so we can eliminate the conflict.</p>
        <p>Try it out!</p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: "Nested Redexes",
    prompt: (
      <div>
        <p>Notice that eta that pops up? That's this REPL's placeholder variable for when it needs to rename something.</p>
        <p>Often, an expression is not beta reducible itself, but contains one or more beta reducible expressions (redexes) nested within. We can still evaluate the expression!</p>
        <p>Try writing a function with a nested redex!</p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: "Leftmost Outermost Redex",
    prompt: (
      <div>
        <p>That probably makes sense.</p>
        <p>"But wait," I hear you shout. "What if I have more than one reducible subexpression in my expression? Which do I evaluate first?"</p>
        <p>Let's traverse the tree, left to right, outer scope to inner scope, find the <i>leftmost outermost redex</i>, and evaluate that one. This is called the <i>normal order</i>.</p>
        <p>Try typing and expanding <Code>((λb.b)c)((λd.d)e)</Code> to see what I mean.</p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: 'Normal Form',
    prompt: (
      <div>
        <p>If we do this repeatedly until there's nothing more to reduce, we get to what's called the "normal form". Finding the normal form is analogous to executing the lambda expression, and is in fact exactly what this REPL does when you enter an expression.</p>
        <p>In this REPL you can see the steps it took to get to normal form by pressing the (+) button beside the evaluated expression.</p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: 'Or Not',
    prompt: (
      <div>
        <p>It's possible that this process never halts, meaning that a normal form for that expression doesn't exist.</p>
        <p>See if you can find an expression whose normal form doesn't exist!</p>
        <p>Possible answer: <span className="secret">(λa.aa)λa.aa</span></p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: 'The Y-Combinator',
    prompt: (
      <div>
        <p>The famed Y-Combinator is one of these expressions. Try inputting the Y-Combinator, and see what happens: <Code>λg.(λx.g(xx))(λx.g(xx))</Code></p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: "Church Booleans",
    prompt: (
      <div>
        <p>Now we're well equipped enough to start working with actual, meaningful values.</p>
        <p>Let's start off by introducing the booleans! The two booleans are:</p>
        <p>true: <Code>λab.a</Code></p>
        <p>false: <Code>λab.b</Code></p>
        <p>You'll notice that these values are themselves are just functions. That's true of any value in the lambda calculus -- all values are just functions that take a cerain form.</p>
        <p>It'll be helpful to assign them to <Code>t</Code> and <Code>f</Code> respectively. Do that.</p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: 'The Not Function',
    prompt: (
      <div>
        <p>We're gonna work our way to defining the XOR (exclusive or) function on booleans.</p>
        <p>Our first step along the way is to define the NOT function. To do this, let's look at the structure of what a boolean looks like.</p>
        <p>True is just a two argument function that selects the first, whereas false is just a two argument function that selects the second argument. We can therefore call a potential true or false value like a function to select either the first or second parameter!</p>
        <p>If you're familiar with the ternary operator in many programming languages, working with booleans in the lambda calculus ends up being about the same.</p>
        <p>Try writing the NOT function, and assign that to <Code>N</Code>.</p>
        <p>Answer: <span className="secret">N := λm.mft</span></p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: 'The Or Function',
    prompt: (
      <div>
        <p>Nice! We've now done the heavy mental lifting of how to use the structure of the value to our advantage.</p>
        <p>You should be well equipped enough to come up with the OR function, a function which takes two booleans and outputs true if either of parameters are true, otherwise false.</p>
        <p>Give it a shot, and assign it to <Code>O</Code></p>
        <p>Answer: <span className="secret">O := λab.atb</span></p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: 'The And Function',
    prompt: (
      <div>
        <p>Prime </p>
        <p>This one's very similar to the previous one. See if you can define the AND function, a function which takes two booleans and outputs true if both parameters are true, otherwise false.</p>
        <p></p>
        <p>Answer: <span className="secret">O := λab.atb</span></p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: 'Composing them all together',
    prompt: (
      <div>
        <p></p>
        <p>For reference, the XOR operation is true iff one parameter is true, but not the other. So TF would be true, but TT would be false.</p>
        <p>Let's see if you can translate that into a composition of the functions you've defined so far.</p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: 'Defining numbers',
    prompt: (
      <div>
        <p>Well, that was a marathon. Take a little break, you've earned it.</p>
        <p>Onto numbers:</p>
      </div>
    ),
    winCondition: () => true,
  },
  {
    title: "lol these aren't finished yet",
    prompt: "aaaahahahahahahah",
    winCondition: () => false,
  },
];
