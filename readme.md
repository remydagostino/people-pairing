# Getting started

```
npm install
mkdir test-data
touch test-data/history.txt
touch test-data/people-list.txt
```

Fill out `people-list.txt` so that it has all the people's names who want to be part of the roster.

Then run `npm run roster` any time you want to generate a list of people pairings. Take the output of this command and append it to `history.txt` to prevent future runs from generating the same pairs.
# Instructions for generating the Beverage Buddy pairings

At the start of the week, run the matcher, giving it the list of people in the rotation this week, and the history of all previous matches.

`people-list.txt` should look something like this. You can comment out people who are unavailable this week by adding a '#' before their name.

```
Salan Akorkin
Joe Dart
# Samuel Jackson
Potato Patatoe
```

`history.txt` should look something like this:

```
2020-01-01 Joe Dart -> Samuel Jackson
2020-01-01 Potato Patatoe -> Joe Dart
2020-01-08 Joe Dart -> Salan Akorkin
2020-01-08 Samuel Jackson -> Potato Patatoe
```

Both of these files should go inside a folder called `test-data`,

```
/people-pairing
  /test-data
    history.txt
    people.txt
```

Then run the matcher like so:

`npm run roster`

Tadaaa... outputted in your console will be the list of pairings for the week. Let everyone know, and once it's all settled append the output to the history.txt.

## Oops!

Oh no, you've shared the list of pairings, but someone is away this week or a new person has joined and you've forgotten to take them into account.

Here are your options for fixing issues:

### 1. Edit people-list.txt and rerun the matcher

This works, but potentially requires people to reschedule meetings with different people which is unideal.

### 2. Edit history.txt and rerun the matcher

Maybe you've run the matcher for the week and realized that you've organized for two people two share a bevvy who routinely share bevvys every day anyway. The algorithm will try to match each person with the person whom they've met for a bevvy least recently. By adding an entry to the history.txt for the two people who ordinarily meet frequently, you can gently encourage the algorithm to prefer different pairings.

### 3. Manually fix the problem without regenerating the match list

If you don't want to rerun the matcher potentially jumble the list, you can run the matcher in "stats mode". This gives you information you can use to fix problems in the list manually.

`npm run stats`

Now, in your console you will see some information you can use to help you decide how to pair off the troublesome person. For each person you will see their "instigationRatio" which is how often they have been on the left-hand side of the arrow versus the right, and you'll see their list of "preferences" which is a sorted list of people to match them with. The number in brackets is the amount of times this person has met with that preference. Pick one of the highest scoring preferences and fix up your week's pairing list. All done!

```json
{
  "name": "Salan Akorkin",
  "instigationRatio": 0.53125,
  "preferences": [
    "Infinity (0): Joe Dart",
    "18811486476 (1): Samuel Jackson",
    "13022686476 (2): Potato Patatoe"
  ]
}
```