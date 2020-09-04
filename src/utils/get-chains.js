export default function getChains(heroes) {
  var heroNames = Object.keys(heroes);
  var initChains = heroNames.reduce((acc, name) => {
    // get initial chains for all heroes
    var res = [[name], compatibleChains([name], heroNames)];
    acc.push(res);
    return acc;
  }, []);

  // TODO: Check if this creates a 5th entry in arr. If so, do a reduce instead of a map to dupe and split the difference of curHeroes
  return chainer(chainer(initChains)).reduce((acc, [prevHeroes, curHeroes]) => {
    curHeroes.forEach((name) => acc.push([...prevHeroes, name]));
    return acc;
  }, []);

  function compatibleChains(curHeroNames, heroNames) {
    // curHeroNames must be an array, even if only one value

    var curHeroName = curHeroNames[curHeroNames.length - 1];
    var {
      chain: [, curChain],
    } = heroes[curHeroName];

    // remove duplicates of curHeroes from the passed in names
    var names = [...heroNames].filter((name) => {
      for (let curName of curHeroNames) {
        if (name == curName) {
          return false;
        }
      }
      return true;
    });

    if (curChain == "all") return names;

    return [...names].filter((name) => {
      var {
        chain: [chain],
      } = heroes[name];
      return chain == "all" || chain == curChain;
    });
  }

  function chainer(chainList) {
    return chainList.reduce((acc, [prevHeroNames, curHeroNames]) => {
      var val = curHeroNames.reduce((acc, heroName) => {
        var v = [...prevHeroNames, heroName];
        var validChains = compatibleChains(v, heroNames);
        var val = [v, validChains];
        if (validChains && validChains[0]) {
          acc.push(val);
        }
        return acc;
      }, []);

      acc.push(...val);
      return acc;
    }, []);
  }
}
