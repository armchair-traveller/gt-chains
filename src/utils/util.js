// sleep util func
export function sleep(ms) {
  return new Promise((fulfil) => {
    setTimeout(fulfil, ms);
  });
}
