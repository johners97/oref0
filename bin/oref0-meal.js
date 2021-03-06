#!/usr/bin/env node

/*
  oref0 meal data tool

  Collects meal data (carbs and boluses for last DIA hours)
  for use in oref0 meal assist algorithm

  Released under MIT license. See the accompanying LICENSE.txt file for
  full terms and conditions

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

*/

var generate = require('oref0/lib/meal');
function usage ( ) {
        console.log('usage: ', process.argv.slice(0, 2), '<pumphistory.json> <profile.json> <clock.json> [carbhistory.json]');
}

if (!module.parent) {
    var pumphistory_input = process.argv.slice(2, 3).pop();
    if ([null, '--help', '-h', 'help'].indexOf(pumphistory_input) > 0) {
      usage( );
      process.exit(0)
    }
    var profile_input = process.argv.slice(3, 4).pop();
    var clock_input = process.argv.slice(4, 5).pop();
    var carb_input = process.argv.slice(5, 6).pop();

    if (!pumphistory_input || !profile_input) {
        usage( );
        process.exit(1);
    }

    var fs = require('fs');
    try {
        var cwd = process.cwd();
        var all_data = require(cwd + '/' + pumphistory_input);
        var profile_data = require(cwd + '/' + profile_input);
        var clock_data = require(cwd + '/' + clock_input);
    } catch (e) {
        return console.error("Could not parse input data: ", e);
    }

    //console.log(carbratio_data);
    var carb_data = { };
    if (typeof carb_input != 'undefined') {
        try {
            carb_data = JSON.parse(fs.readFileSync(carb_input, 'utf8'));
            //console.error(JSON.stringify(carb_data));
        } catch (e) {
            //console.error("Warning: could not parse carb_input.");
        }
    }

    // all_data.sort(function (a, b) { return a.date > b.date });

    var inputs = {
        history: all_data
    , profile: profile_data
    , clock: clock_data
    , carbs: carb_data
    };

    var dia_carbs = generate(inputs);
    console.log(JSON.stringify(dia_carbs));
}

