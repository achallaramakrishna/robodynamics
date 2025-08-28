package com.robodynamics.util;

public class Pair<L, R> {
  private final L left;
  private final R right;

  private Pair(L left, R right) { this.left = left; this.right = right; }
  public static <L,R> Pair<L,R> of(L l, R r){ return new Pair<>(l,r); }
  public L getLeft(){ return left; }
  public R getRight(){ return right; }
}
