//1
function price(order) {
  //가격(price) = 기본 가격 - 수량할인 + 배송비
  return (
    order.quantity * order.itemPrice -
    //500개보다 많을때 할인
    Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 +
    //100개보다 적을때 할인
    Math.min(order.quantity * order.itemPrice * 0.1, 100)
  );
}
